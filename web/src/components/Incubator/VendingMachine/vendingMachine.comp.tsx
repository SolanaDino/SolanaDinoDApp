import React, { createElement, FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ToastContainer } from "react-toastify";
import { Button, Slider } from "antd";

import {
  createIncubatorTx,
  createRedeemTxD,
  getPendingIncubator,
  getWinningMint,
} from "actions/incubator";
import { messageToast } from "utils/toast";
import * as assets from "assets";
import * as models from "models";
import * as hooks from "hooks";
import * as mints from "consts/mints";
import * as utils from "utils";

import * as globalComps from "components/Global";

import * as consts from "../IncubatorInterface.const";
import * as styled from "./vendingMachine.styles";
import * as _consts from "./vendingMachine.const";
import axios from "axios";

export interface IVendingMachineInterface {}

export const VendingMachineComp: FC<IVendingMachineInterface> = ({}) => {
  const [status, setStatus] = useState<models.IIncubatorStatus>("READY");
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [map, setmap] = useState<models.IIncubatorVendingMachineViewMap>(
    _consts.CREATE_VENDING_MACHINE_SFT_VIEW_MAP
  );

  const { ataMap } = hooks.useAssociatedTokenAccounts();
  const auxTokenAccounts = hooks.useGroupedAuxTokenAccounts();
  const { incubatorProgram } = hooks.useIncubatorProgram();
  const { solBalance } = hooks.useSolBalance();
  const { hatcherRealProgram, hatcherFakeProgram } = hooks.useHatcherProgram();

  const [incubatorAcct, setIncubatorAcct] = useState<web3.PublicKey>();
  const [eggRarity, setEggRarity] = useState<models.IEggRarities>();
  const [hatchEgg, setHatchEgg] = useState<models.IEggRarities>();
  const [dinoNft, setDinoNft] = useState<number>(-1);
  const [dinoAttributes, setDinoAttributes] = useState<any>();
  const [dinoNftInstructions, setDinoNftInstructions] = useState<any>();

  const [homeButton, setHomeButton] = useState(false);

  const navKeyList = Object.keys(
    _consts.CREATE_VENDING_MACHINE_SFT_VIEW_MAP
  ) as models.IIncubatorVendingMachineViews[];
  const navLength = navKeyList.length;

  const [currentView, setCurrentView] =
    useState<models.IIncubatorVendingMachineViewState>(() => _consts.INIT_VIEW);

  useEffect(() => {
    checkOngoingMint();
  }, [incubatorProgram]);

  useEffect(() => {
    checkOngoingNftMint();
  }, [hatcherFakeProgram]);

  const checkOngoingMint = async () => {
    if (publicKey && incubatorProgram) {
      const iAcct = await getPendingIncubator(
        incubatorProgram,
        publicKey
      ).catch(() => undefined);

      if (iAcct) {
        const winningMintRarity = await getWinningMint(iAcct, connection);
        setIncubatorAcct(iAcct as unknown as web3.PublicKey);
        setEggRarity(winningMintRarity);
        setCurrentView(_consts.TRANSITION_VIEW);
      }
    }
  };

  const checkOngoingNftMint = async () => {
    if (publicKey && hatcherFakeProgram) {
      const hatcherAccountKey = anchor.utils.publicKey.findProgramAddressSync(
        [publicKey.toBuffer()],
        hatcherFakeProgram.programId
      )[0];

      const assignIx = await hatcherFakeProgram.methods
        .assignWinningHash()
        .accounts({
          hatcher: hatcherAccountKey,
          slotHashes: new anchor.web3.PublicKey(
            "SysvarS1otHashes111111111111111111111111111"
          ),
        })
        .instruction();

      try {
        const winningMint = await checkWinningMint(hatcherAccountKey, assignIx);
        if (winningMint) {
          setmap(_consts.CREATE_VENDING_MACHINE_NFT_VIEW_MAP);
          setCurrentView(_consts.TRANSITION_VIEW);
          setHatchEgg("BLUE");

          setDinoNft(winningMint);
          setDinoNftInstructions(assignIx);
        }
      } catch (error) {
        console.log("No pending nft claim");
      }
    }
  };

  const initIncubator = async (
    wallet: web3.PublicKey,
    ataInfoEgg: models.ITokenAccount,
    amount: number
  ) => {
    try {
      const transaction = await createIncubatorTx(
        incubatorProgram,
        wallet,
        new web3.PublicKey(ataInfoEgg.pubkey),
        amount
      );

      const result = await sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      await connection.confirmTransaction(result, "singleGossip");

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const redeemEgg = async (
    wallet: web3.PublicKey,
    winningMintRarity: models.IEggRarities
  ) => {
    try {
      const winningMint = consts.EGG_RARITIES_MAP[winningMintRarity].mint;

      const transaction = await createRedeemTxD(
        wallet,
        incubatorProgram,
        winningMint,
        connection
      );

      const result = await sendTransaction(transaction, connection);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnHatch = async (egg: models.IEggRarities) => {
    const eggMint = _consts.EGG_RARITIES_MAP[egg].mint;
    const ataEgg = ataMap.get(eggMint.toString());
    const auxEgg = auxTokenAccounts.get(eggMint.toString());

    const tokenAcct = utils.getAccountWithBalance(auxEgg, ataEgg);

    if (solBalance < 0.12) {
      messageToast("error", "Hatching failed, make sure you have enough sol.");
      return;
    }

    if (tokenAcct && publicKey) {
      try {
        await hatcherRealProgram.methods
          .beginHatch()
          .accounts({
            eggNftAcct: tokenAcct,
            eggNftMint: eggMint,
          })
          .rpc();
        setHatchEgg(egg);
        handleOnNext();
      } catch (err) {
        const errorParsed = JSON.parse(JSON.stringify(err, null, 2));

        if (errorParsed.name == "WalletSignTransactionError") {
          return;
        }

        if (errorParsed.name == "Already minting dino") {
          setHatchEgg(egg);
          handleOnNext();
        } else {
          setHatchEgg(egg);
          handleOnNext();
          console.log(JSON.stringify(err, null, 2));
        }
      }
      setHomeButton(true);
      setHatchEgg(egg);
      handleOnNext();

      const hatcherAccountKey = anchor.utils.publicKey.findProgramAddressSync(
        [publicKey.toBuffer()],
        hatcherRealProgram.programId
      )[0];

      const assignIx = await hatcherFakeProgram.methods
        .assignWinningHash()
        .accounts({
          hatcher: hatcherAccountKey,
          slotHashes: new anchor.web3.PublicKey(
            "SysvarS1otHashes111111111111111111111111111"
          ),
        })
        .instruction();

      let winningMint = undefined;

      // await utils.sleep(4000);

      while (!winningMint) {
        await utils.sleep(4000);
        winningMint = await checkWinningMint(hatcherAccountKey, assignIx);
      }

      setDinoNft(winningMint);
      setDinoNftInstructions(assignIx);

      console.log(`index to claim is ${winningMint}`);
    }
  };

  const checkWinningMint = async (
    hatcherAccountKey: web3.PublicKey,
    preInstructions: web3.TransactionInstruction
  ) => {
    try {
      const maskPubkey = anchor.utils.publicKey.findProgramAddressSync(
        [Buffer.from("claim_mask")],
        hatcherFakeProgram.programId
      )[0];

      let a = await hatcherFakeProgram.views?.getWinningIndex({
        accounts: {
          hatcher: hatcherAccountKey,
          claimMask: maskPubkey,
        },
        preInstructions: [preInstructions],
      });

      return a;
    } catch (error) {
      const errorParsed = JSON.parse(JSON.stringify(error, null, 2));
      console.log(errorParsed);
      return undefined;
    }

    // let idxtx = await hatcherProgram.methods
    // .getWinningIndex()
    // .accounts({
    //   hatcher: hatcherAccountKey,
    // })
    // .preInstructions([assignIx])
    // .transaction();
    // idxtx.feePayer = publicKey;
    // idxtx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // const rimulateTx = await connection.simulateTransaction(idxtx);
    // const rawValue = rimulateTx.value.logs
    //   ?.find((value) => {
    //     if (
    //       value.includes(
    //         "Program return: HAtcHcNADtwriNaXzkLqMjANDxKSV9Zy5MK2m9kiYzCS"
    //       )
    //     ) {
    //       return true;
    //     }
    //   })
    //   ?.split(" ")
    //   .pop();

    // console.log(rawValue);
  };

  const handleOnMint = async (input: number) => {
    setHomeButton(true);
    console.log("minting egg");
    const ataInfoEgg = ataMap.get(mints.EGG_MINT.toString());

    if (publicKey && ataInfoEgg?.ataInfo) {
      try {
        handleOnNext();
        setStatus("MINTING");
        let iAcct = await getPendingIncubator(incubatorProgram, publicKey);
        if (!iAcct) {
          messageToast("warning", "Don't click away during minting.");

          const txid = await initIncubator(
            publicKey,
            ataInfoEgg,
            1000000 + input * 1000000
          );

          iAcct = await getPendingIncubator(incubatorProgram, publicKey);
        }

        console.log(iAcct);

        console.log("incubator ready, waiting for winning mint");
        const winningMintRarity = await getWinningMint(iAcct, connection);
        setEggRarity(winningMintRarity);
      } catch (e) {
        console.error("err", e);
        messageToast("error", "Minting failed, make sure you have enough sol.");
        handleOnPrev();
        setHomeButton(false);
        setStatus("READY");
      }
    }
  };

  const handleOnRedeemNft = async () => {
    //build the claim instruction
    console.log(dinoNft);
    if (publicKey) {
      const mint = web3.Keypair.generate();
      const dinoMetadataAccount = anchor.utils.publicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
          ).toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      )[0];
      const dinoTokenAccount = await anchor.utils.token.associatedAddress({
        mint: mint.publicKey,
        owner: publicKey,
      });

      const proofData = (
        await axios.get(`https://api.solanadino.com/proofs/${dinoNft}`)
      ).data.reply;

      const object = await (await fetch(proofData.uri)).json();

      //(await axios.get(proofData.uri)).data.reply;
      setDinoAttributes(object);

      await hatcherRealProgram.methods
        .claimDino(
          //use index returned above to look this up
          proofData.uri.replace("https://arweave.net/", ""), // "YfNxJkoF_93yWUvQXkrOm0QqZO-EgEuCAUYSm-oL60U", //leave off "https://arweave.net/""
          proofData.name.replace("SolanaDINO Genesis Era #", ""), //leave off "SolanaDINO Genesis Era #"",
          proofData.proof.map((a: any) => Buffer.from(a, "base64"))
        )
        .accounts({
          feeAccount: new anchor.web3.PublicKey(
            "FEes6DWHdanTJndiHjivUF3rtAaGcuSgtBb56Mb9aV2W"
          ),
          dinoMint: mint.publicKey,
          dinoMetadataAccount,
          dinoTokenAccount,
          //fine to hard code these
          metadataProgram: new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
          ),
          collectionMint: new anchor.web3.PublicKey(
            "DS1HUpxYUgySgNf1L6qzKNyU8akoKDahxhuiGkV4y7Vs"
          ),
          collectionMetadata: new anchor.web3.PublicKey(
            "B6czFPKghvbntrYmHXiFWAyXh9fXHwEazZPXoshMJCiF"
          ),
          collectionMasterEdition: new anchor.web3.PublicKey(
            "6ANFNf5pG9FRsXX6Br69LxzDRDS5RfyGT2RK7qPG53RW"
          ),
          collectionAuthorityRecord: new anchor.web3.PublicKey(
            "5gaJrn9zV8moJfUHMJzsCCwEo8HvoquTfQzZWKRD6n9j"
          ),
        })
        .preInstructions([dinoNftInstructions])
        .signers([mint])
        .rpc();

      handleOnNext();
      setHomeButton(false);
    }
  };

  const handleOnRedeem = async () => {
    const ataInfoEgg = ataMap.get(mints.EGG_MINT.toString());

    if (publicKey && ataInfoEgg?.ataInfo && eggRarity) {
      try {
        let iAcct = await getPendingIncubator(incubatorProgram, publicKey);
        if (!iAcct) {
          await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
          });
          iAcct = await getPendingIncubator(incubatorProgram, publicKey);
          if (!iAcct) {
            return;
          }
        }

        await redeemEgg(publicKey, eggRarity);

        setStatus("DONE");
        messageToast("success", "Egg NFT redeemed.");
      } catch (e) {
        messageToast(
          "error",
          "Redeeming failed, please refresh and try again."
        );
        console.error("err", e);
        handleOnPrev();
        setEggRarity(undefined);
      } finally {
        setHomeButton(false);
        setIncubatorAcct(undefined);
      }
    }
  };

  // Navigation between views
  const handleOnNext = () => {
    const newIdx = currentView.idx + 1;
    setCurrentView(() => ({
      view: navKeyList[newIdx],
      idx: newIdx,
    }));
  };
  const handleOnPrev = () => {
    const newIdx = currentView.idx - 1;
    setCurrentView(() => ({
      view: navKeyList[newIdx],
      idx: newIdx,
    }));
  };
  const handleOnComplete = () => {
    setEggRarity(undefined);
    setDinoNft(-1);
    setDinoAttributes({});

    setCurrentView(_consts.INIT_VIEW);
  };
  const handleOnSwitch = (switchValue: Number) => {
    const newIdx = currentView.idx + 1;
    switch (switchValue) {
      case 0:
        setmap(_consts.CREATE_VENDING_MACHINE_SFT_VIEW_MAP);
        break;
      case 1:
        setmap(_consts.CREATE_VENDING_MACHINE_NFT_VIEW_MAP);
        break;
    }
    setCurrentView(() => ({
      view: navKeyList[newIdx],
      idx: newIdx,
    }));
  };
  const handleOnHome = () => {
    setmap(_consts.CREATE_VENDING_MACHINE_SFT_VIEW_MAP);
    setCurrentView(() => ({
      view: navKeyList[0],
      idx: 0,
    }));
  };

  return (
    <>
      <styled.VendingMachineComp bgImg={assets.VENDING_MACHINE_V2}>
        <styled.VendingMachineWrapper>
          <styled.VendingMachineScreen>
            {createElement(map[currentView.view].comp, {
              onNext: handleOnNext,
              onComplete: handleOnComplete,
              onPrev: handleOnPrev,
              onSwitch: handleOnSwitch,
              onMint: handleOnMint,
              onHatch: handleOnHatch,
              onRedeem: handleOnRedeem,
              onRedeemNft: handleOnRedeemNft,
              dinoNft: dinoNft,
              dinoAttributes: dinoAttributes,
              eggRarity: eggRarity,
              hatchEgg: hatchEgg,
              showPrev: !!currentView.idx,
              isLastView: currentView.idx === navLength - 1,
            })}
          </styled.VendingMachineScreen>
          <styled.VendingMachineControls>
            <styled.VendingMachineHomeButton>
              <globalComps.PrimaryButton
                className="btn-ls"
                onClick={() => handleOnHome()}
                disabled={homeButton}
              >
                Home
              </globalComps.PrimaryButton>
            </styled.VendingMachineHomeButton>
            <styled.VendingMachineDisplayText>
              {status}
            </styled.VendingMachineDisplayText>
            <styled.VendingMachineLED
              isBusy={status == "MINTING"}
            ></styled.VendingMachineLED>
          </styled.VendingMachineControls>
        </styled.VendingMachineWrapper>
      </styled.VendingMachineComp>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
