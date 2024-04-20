import React, { useCallback, useState } from "react";
import { TransactionInstruction } from "@solana/web3.js";
import { ToastContainer } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Row, Col, Card, Modal } from "antd";

import { LoveShackStake } from "components/LoveShack/LoveShackStake";
import { LoveShackSummaryComp } from "components/LoveShack/LoveShackSummary";
import * as loveShackComps from "components/LoveShack";
import * as actions from "actions";
import * as mints from "consts/mints";
import * as models from "models";
import * as hooks from "hooks";

import { LoaderContainer } from "components/LoaderContainer";
import { messageToast } from "utils/toast";
import "react-toastify/dist/ReactToastify.css";
import dinoLogo from "assets/dino-icon.png";
import raydiumLogo from "assets/raydium-icon.png";
import stepLogo from "assets/step-icon.png";
import { generateTransaction } from "actions";

import * as styled from "./loveshack.styles";

export const LoveshackView = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const groupedAuxTokenAccounts = hooks.useGroupedAuxTokenAccounts();
  const userAccounts = hooks.useUserAccounts();
  const { ataMap } = hooks.useAssociatedTokenAccounts();
  const { dinoLsAccts } = hooks.useDinoLsAccounts();
  const { stepLsAccts } = hooks.useStepLsAccounts();
  const { raydiumLsAccts } = hooks.useRaydiumLsAccounts();
  const { loveShackProgram } = hooks.useLoveShackProgram();
  const { stakingAccts } = hooks.useStakingAccounts();

  const dinoStakingCard = hooks.useDinoStakingCard();
  const stepStakingCard = hooks.useStepStakingCard();
  const raydiumStakingCard = hooks.useRaydiumStakingCard();
  const totaltakingCard = hooks.useTotalStakingCard();

  const [loadingShow, setLoadingShow] = useState(false);

  const [isDinoPoolStake, setIsDinoPoolStake] = useState(false);
  const [isDinoPoolModalVisible, setIsDinoPoolModalVisible] = useState(false);

  const [isRaydiumPoolStake, setIsRaydiumPoolStake] = useState(false);
  const [isRaydiumPoolModalVisible, setIsRaydiumPoolModalVisible] =
    useState(false);

  const [isStepPoolStake, setIsStepPoolStake] = useState(false);
  const [isStepPoolModalVisible, setIsStepPoolModalVisible] = useState(false);

  const showDinoPoolModal = (isStake: boolean) => {
    setIsDinoPoolStake(isStake);
    setIsDinoPoolModalVisible(true);
  };

  const showRaydiumPoolModal = (isStake: boolean) => {
    setIsRaydiumPoolStake(isStake);
    setIsRaydiumPoolModalVisible(true);
  };

  const showStepPoolModal = (isStake: boolean) => {
    setIsStepPoolStake(isStake);
    setIsStepPoolModalVisible(true);
  };

  const stakeToken = async (
    amount: number,
    mint: PublicKey,
    lsAccts: models.LoveshackAccounts,
    decimals: number
  ) => {
    try {
      const ataInfo = ataMap.get(mint.toString());
      const ataInfoEgg = ataMap.get(mints.EGG_MINT.toString());
      if (!publicKey || !stakingAccts || !ataInfo || !ataInfoEgg) {
        return;
      }

      let instructions: TransactionInstruction[] = initLsInstructions(mint);

      var toastSucces = "Successfully staked " + amount + " $DINO!";
      var toastProcces = "Processing staking transaction.";
      var toastError = "Staking transaction failed, please try again.";

      actions.createStakeDinoInstruction(
        instructions,
        loveShackProgram,
        publicKey,
        new web3.PublicKey(ataInfo.pubkey),
        stakingAccts.stakeAcctNew,
        lsAccts.holdingAcct,
        mint,
        amount,
        decimals
      );

      if (Number(totaltakingCard.unClaimedEgg) !== 0) {
        if (!ataInfoEgg?.ataInfo && ataInfoEgg?.pubkey) {
          actions.addAtaInstruction(
            instructions,
            new web3.PublicKey(ataInfoEgg.pubkey),
            publicKey,
            mints.EGG_MINT
          );
        }
        //EGG CLAIM
        if (dinoLsAccts.authAcct) {
          actions.claimEggInstruction(
            instructions,
            loveShackProgram,
            publicKey,
            new web3.PublicKey(ataInfoEgg.pubkey),
            stakingAccts.stakeAcctNew,
            dinoLsAccts.authAcct
          );
        }
      }

      createTransaction(instructions, toastProcces, toastSucces, toastError);
    } catch (error) { }
  };

  const unStakeToken = async (
    amount: number,
    mint: PublicKey,
    lsAccts: models.LoveshackAccounts,
    decimals: number
  ) => {
    try {
      const ataInfo = ataMap.get(mint.toString());
      const ataInfoEgg = ataMap.get(mints.EGG_MINT.toString());
      if (
        !publicKey ||
        !stakingAccts?.stakeAcctNewInfo ||
        !ataInfo ||
        !ataInfoEgg
      ) {
        return;
      }

      let instructions: TransactionInstruction[] = initLsInstructions(mint);

      var toastSucces = "Successfully unstaked " + amount + " $DINO!";
      var toastProcces = "Processing staking transaction.";
      var toastError = "Staking transaction failed, please try again.";

      actions.getStakeDinoInstruction(
        instructions,
        loveShackProgram,
        publicKey,
        new web3.PublicKey(ataInfo.pubkey),
        stakingAccts.stakeAcctNew,
        lsAccts.holdingAcct,
        mint,
        amount,
        decimals
      );

      if (Number(totaltakingCard.unClaimedEgg) !== 0) {
        if (!ataInfoEgg?.ataInfo && ataInfoEgg?.pubkey) {
          actions.addAtaInstruction(
            instructions,
            new web3.PublicKey(ataInfoEgg.pubkey),
            publicKey,
            mints.EGG_MINT
          );
        }
        //EGG CLAIM
        if (dinoLsAccts.authAcct) {
          actions.claimEggInstruction(
            instructions,
            loveShackProgram,
            publicKey,
            new web3.PublicKey(ataInfoEgg.pubkey),
            stakingAccts.stakeAcctNew,
            dinoLsAccts.authAcct
          );
        }
      }

      createTransaction(instructions, toastProcces, toastSucces, toastError);
    } catch (error) { }
  };

  const initLsInstructions = (mint: PublicKey): TransactionInstruction[] => {
    try {
      const ataInfo = ataMap.get(mint.toString());

      if (!publicKey || !loveShackProgram || !stakingAccts || !ataInfo) {
        return [] as TransactionInstruction[];
      }

      let instructions: TransactionInstruction[] = [];
      var toastSucces: string = "";
      var toastProcces: string = "";
      var toastError: string = "";

      if (groupedAuxTokenAccounts.has(mint.toString())) {
        // migrate accts
        toastSucces = "Successfully migrated auxillary token accounts.";
        toastProcces = "Proccessing auxillary token account migration.";
        toastError = "Auxillary token account migration failed.";

        actions.createMigrateTokensInstruction(
          instructions,
          groupedAuxTokenAccounts,
          ataMap,
          publicKey,
          [],
          mint
        );
      } else if (!ataInfo?.ataInfo && ataInfo?.pubkey) {
        // create ata
        toastSucces = "Successfully created associated token account.";
        toastProcces = "Proccessing associated token account creation.";
        toastError = "Associated token account creation failed.";
        actions.addAtaInstruction(
          instructions,
          new web3.PublicKey(ataInfo.pubkey),
          publicKey,
          mint
        );
      }

      if (stakingAccts.stakeAcctOldInfo) {
        // migrate staking accounts
        toastSucces = "Successfully migrated staking accounts.";
        toastProcces = "Proccessing staking account migration.";
        toastError = "Staking account migration failed.";

        actions.createMigrateStakingAcctsInstruction(
          instructions,
          loveShackProgram,
          publicKey,
          stakingAccts.stakeAcctOld,
          stakingAccts.stakeAcctNew
        );
        console.log("migrate");
      } else if (!stakingAccts.stakeAcctNewInfo) {
        // create (new) staking acct
        toastSucces = "Successfully created staking accounts.";
        toastProcces = "Proccessing staking account creation.";
        toastError = "Staking account creation failed.";

        actions.createStakingAccountInstruction(
          instructions,
          loveShackProgram,
          publicKey,
          stakingAccts.stakeAcctNew
        );
        console.log("create");
      }

      return instructions;

      // createTransaction(instructions, toastProcces, toastSucces, toastError);
    } catch (error) {
      console.log(error);
      return [] as TransactionInstruction[];
      // handle with toast message
    }
  };

  const claimEgg = async () => {
    try {
      const ataInfo = ataMap.get(mints.EGG_MINT.toString());

      if (!publicKey || !stakingAccts.stakeAcctNewInfo || !ataInfo) {
        return;
      }

      let instructions: TransactionInstruction[] = [];
      var toastSucces = "Successfully claimed $DINOEGG!";
      var toastProcces = "Processing $DINOEGG claim.";
      var toastError = "Claiming $DINOEGG failed, please try again.";

      if (!ataInfo?.ataInfo && ataInfo?.pubkey) {
        actions.addAtaInstruction(
          instructions,
          new web3.PublicKey(ataInfo.pubkey),
          publicKey,
          mints.EGG_MINT
        );
      }
      //EGG CLAIM
      if (!dinoLsAccts.authAcct) {
        return;
      }
      actions.claimEggInstruction(
        instructions,
        loveShackProgram,
        publicKey,
        new web3.PublicKey(ataInfo.pubkey),
        stakingAccts.stakeAcctNew,
        dinoLsAccts.authAcct
      );

      createTransaction(instructions, toastProcces, toastSucces, toastError);
    } catch (error) { }
  };

  const createTransaction = useCallback(
    async (
      instructions: TransactionInstruction[],
      toastProcces: string,
      toastSucces: string,
      toastError: string
    ) => {
      const hackyWallet = {
        publicKey: publicKey,
        signTransaction: signTransaction,
      } as any;

      const signers: any = [];

      messageToast("info", toastProcces);
      setLoadingShow(true);
      setIsDinoPoolModalVisible(false);
      setIsRaydiumPoolModalVisible(false);
      setIsStepPoolModalVisible(false);

      const transaction = await generateTransaction(
        connection,
        publicKey,
        instructions,
        []
      );

      const result = await sendTransaction(transaction, connection)
        .then((value) => {
          messageToast("success", toastSucces);
        })
        .catch((err) => {
          messageToast("error", toastError);
          console.log(err);
        })
        .finally(() => setLoadingShow(false));
    },
    [
      publicKey,
      connection,
      userAccounts,
      dinoLsAccts,
      stakingAccts,
      groupedAuxTokenAccounts,
      sendTransaction,
    ]
  );

  return (
    <styled.LoveshackView>
      {/* <Row className={loadingShow ? "dynamic-load" : ""} gutter={[48, 48]}>
        <Col > */}
      <styled.LoveShackInterfaceWrapper>
        <LoveShackSummaryComp
          onClaimStake={() => claimEgg()}
        ></LoveShackSummaryComp>
        <styled.LoveShackCard>
          <loveShackComps.LoveShackInterfaceComp
            stakingType={"DINO"}
            stakingCard={dinoStakingCard}
          ></loveShackComps.LoveShackInterfaceComp>
          <loveShackComps.LoveShackButtons
            stakingType={"DINO"}
            onInitLsInstructions={() => initLsInstructions(mints.DINO_MINT)}
            onOpenStakeModal={() => showDinoPoolModal(true)}
            onOpenUnStakeModal={() => showDinoPoolModal(false)}
          ></loveShackComps.LoveShackButtons>
        </styled.LoveShackCard>
      </styled.LoveShackInterfaceWrapper>
      {/* </Col>
        <Col style={{ margin: 'auto' }} xs={{ span: 24 }} lg={{ span: 12 }}> */}
      <styled.LoveShackInterfaceWrapper>
        <styled.LoveShackCard>
          <loveShackComps.LoveShackInterfaceComp
            stakingType={"RAYDIUM"}
            stakingCard={raydiumStakingCard}
          ></loveShackComps.LoveShackInterfaceComp>
          <loveShackComps.LoveShackButtons
            stakingType={"RAYDIUM"}
            onInitLsInstructions={() =>
              initLsInstructions(mints.DINO_RAYDIUMLP_MINT)
            }
            onOpenStakeModal={() => showRaydiumPoolModal(true)}
            onOpenUnStakeModal={() => showRaydiumPoolModal(false)}
          ></loveShackComps.LoveShackButtons>
        </styled.LoveShackCard>
      </styled.LoveShackInterfaceWrapper>
      {/* </Col> */}
      {/* <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <styled.LoveShackCard>
            <loveShackComps.LoveShackInterfaceComp
              stakingType={"STEP"}
              stakingCard={stepStakingCard}
            ></loveShackComps.LoveShackInterfaceComp>
            <loveShackComps.LoveShackButtons
              stakingType={"STEP"}
              onInitLsInstructions={() =>
                initLsInstructions(mints.DINO_STEPLP_MINT)
              }
              onOpenStakeModal={() => showStepPoolModal(true)}
              onOpenUnStakeModal={() => showStepPoolModal(false)}
            ></loveShackComps.LoveShackButtons>
          </styled.LoveShackCard>
        </Col> */}
      {/* </Row> */}
      <Modal
        title="Love Shack DINO pool"
        visible={isDinoPoolModalVisible}
        onOk={() => setIsDinoPoolModalVisible(false)}
        onCancel={() => setIsDinoPoolModalVisible(false)}
        footer={null}
      >
        <LoveShackStake
          icon={dinoLogo}
          isStake={isDinoPoolStake}
          stakedMintABalance={dinoStakingCard.stakedMintABalance}
          unstakedMintABalance={dinoStakingCard.unstakedMintABalance}
          onStake={(value: number) =>
            stakeToken(value, mints.DINO_MINT, dinoLsAccts, 6)
          }
          onUnStake={(value: number) =>
            unStakeToken(value, mints.DINO_MINT, dinoLsAccts, 6)
          }
        ></LoveShackStake>
      </Modal>

      <Modal
        title="Raydium USDC-DINO pool"
        visible={isRaydiumPoolModalVisible}
        onOk={() => setIsRaydiumPoolModalVisible(false)}
        onCancel={() => setIsRaydiumPoolModalVisible(false)}
        footer={null}
      >
        <LoveShackStake
          icon={raydiumLogo}
          isStake={isRaydiumPoolStake}
          stakedMintABalance={raydiumStakingCard.stakedMintABalance}
          unstakedMintABalance={raydiumStakingCard.unstakedMintABalance}
          onStake={(value: number) =>
            stakeToken(value, mints.DINO_RAYDIUMLP_MINT, raydiumLsAccts, 6)
          }
          onUnStake={(value: number) =>
            unStakeToken(value, mints.DINO_RAYDIUMLP_MINT, raydiumLsAccts, 6)
          }
        ></LoveShackStake>
      </Modal>

      <Modal
        title="Step USDC-DINO pool"
        visible={isStepPoolModalVisible}
        onOk={() => setIsStepPoolModalVisible(false)}
        onCancel={() => setIsStepPoolModalVisible(false)}
        footer={null}
      >
        <LoveShackStake
          icon={stepLogo}
          isStake={isStepPoolStake}
          isSmallStep={true}
          stakedMintABalance={stepStakingCard.stakedMintABalance}
          unstakedMintABalance={stepStakingCard.unstakedMintABalance}
          onStake={(value: number) =>
            stakeToken(value, mints.DINO_STEPLP_MINT, stepLsAccts, 8)
          }
          onUnStake={(value: number) =>
            unStakeToken(value, mints.DINO_STEPLP_MINT, stepLsAccts, 8)
          }
        ></LoveShackStake>
      </Modal>

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

      <LoaderContainer loadingShow={loadingShow}></LoaderContainer>
    </styled.LoveshackView>
  );
};
