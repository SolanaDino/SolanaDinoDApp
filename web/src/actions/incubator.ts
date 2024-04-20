import {
  AccountInfo,
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { Program, BN, utils } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

import * as incubatorUtils from "utils/incubator.utils";
import * as mints from "consts/mints";
import * as models from "models";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

export const getPendingIncubator = async (
  program: Program,
  wallet: PublicKey
) => {
  let [incubator, _incubatorNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer()],
    program.programId
  );
  let iAcct = await program.account.incubator.fetchNullable(incubator);
  return iAcct;
};

export const createIncubator = async (
  instructions: TransactionInstruction[],
  program: Program,
  wallet: PublicKey,
  tokenAccount: PublicKey,
  amount: number
) => {
  let [incubator, incubatorNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer()],
    program.programId
  );
  instructions.push(
    program.instruction.beginCreate(incubatorNonce, new BN(amount), {
      accounts: {
        owner: wallet,
        incubator: incubator,
        eggAcct: tokenAccount,
        eggMint: mints.EGG_MINT,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: mints.SYSTEM_PROGRAM_ID,
      },
    })
  );
  return;
};

export const createIncubatorTx = async (
  program: Program,
  wallet: PublicKey,
  tokenAccount: PublicKey,
  amount: number
) => {
  let [incubator, incubatorNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer()],
    program.programId
  );
  let tx = program.transaction.beginCreate(incubatorNonce, new BN(amount), {
    accounts: {
      owner: wallet,
      incubator: incubator,
      eggAcct: tokenAccount,
      slotHashes: mints.SLOT_HASHES_SYSVAR,
      recentBlockhashes: mints.RECENT_BLOCKHASHES_SYSVAR,
      eggMint: mints.EGG_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: mints.SYSTEM_PROGRAM_ID,
    },
  });
  return tx;
};

export const getWinningMint = async (iAcct: any, connection: Connection) => {
  const slot = parseInt(iAcct?.slot?.toString() ?? 0) + 6;
  let found = false;
  let winner;
  while (true) {
    const hashesAccount = await connection.getAccountInfo(
      mints.SLOT_HASHES_SYSVAR
    );
    if (hashesAccount) {
      const slotHashes = incubatorUtils.getSlotHashes(hashesAccount);

      let counter = 0;
      let maybeWinner = [-1, undefined];
      for (let sh of slotHashes as any) {
        const _sh = sh as any;
        if (_sh[0] + 1 == maybeWinner[0]) {
          winner = maybeWinner;
        }

        if (_sh[0] <= slot) {
          found = true;
          break;
        }

        maybeWinner = _sh;
        counter++;
      }
      if (found && winner) {
        break;
      }
      if (counter > 150) {
        //waited too long
        break;
      }
      console.log("counted", counter, "reading again");
      await incubatorUtils.sleep(2000);
    }
  }

  console.log("found", found, "winner", winner);

  let winningMint;
  if (!found || !winner) {
    console.log("fallback");
    if (iAcct.amountBurned.toNumber() < 4000000) {
      winningMint = "BLUE" as models.IEggRarities;
    } else {
      winningMint = "GREEN" as models.IEggRarities;
    }
  } else {
    console.log("winning hash found");

    const blockhashBytes = utils.bytes.bs58.decode(winner[1]?.toString() ?? "");

    let seed = new BN(blockhashBytes.slice(12, 20), 10, "le").mul(
      new BN(1000000, 10)
    );
    const seedSpace = new BN(2, 10)
      .pow(new BN(64, 10))
      .sub(new BN(1, 10))
      .mul(iAcct.amountBurned);

    console.log("seed", seed.toString(), "seedSpace", seedSpace.toString());

    if (seed.lt(seedSpace.div(new BN(10000, 10)))) {
      winningMint = "MYTHICAL" as models.IEggRarities;
    } else if (seed.lt(seedSpace.div(new BN(50, 10)))) {
      winningMint = "PURPLE" as models.IEggRarities;
    } else if (seed.lt(seedSpace.div(new BN(4, 10)))) {
      winningMint = "GREEN" as models.IEggRarities;
    } else {
      winningMint = "BLUE" as models.IEggRarities;
    }
  }
  return winningMint;
};

export const getWinningMint2 = async (iAcct: any, connection: Connection) => {
  const slot = parseInt(iAcct.priorSlot.toString()) + 6;
  console.log("waiting for slot", slot);
  let winningSlot;
  do {
    const confirmedSlots = await connection.getBlocks(
      slot,
      slot + 512,
      `confirmed`
    );
    console.log("got slots", confirmedSlots);

    if (confirmedSlots.length <= 1) {
      await new Promise(function (resolve) {
        setTimeout(resolve, 2000);
      });
      continue;
    }

    for (let i = 0; i < confirmedSlots.length - 1; i++) {
      const blockTemp = await connection.getBlock(confirmedSlots[i], {
        commitment: "confirmed",
      });
      console.log(
        "slot",
        confirmedSlots[i],
        "block",
        blockTemp?.blockhash.toString()
      );

      if (confirmedSlots[i] + 1 == confirmedSlots[i + 1]) {
        winningSlot = confirmedSlots[i] + 1;
        break;
      }
    }
  } while (!winningSlot);
  console.log("winning slot", winningSlot);
  let winningMint;

  const block = await connection.getBlock(winningSlot, {
    commitment: "confirmed",
  });
  if (block) {
    console.log("blockhash", block?.blockhash.toString());

    const blockhashBytes = bs58.decode(block?.blockhash);
    console.log("blockhashBytes", blockhashBytes);

    let seed = new BN(blockhashBytes.slice(12, 20), 10, "le").mul(
      new BN(1000000, 10)
    );
    console.log("seed", seed.toString());

    const seedSpace = new BN(2, 10)
      .pow(new BN(64, 10))
      .sub(new BN(1, 10))
      .mul(new BN(iAcct.amountBurned, 10));
    console.log("seedSpace", seedSpace.toString());

    if (seed.lt(seedSpace.div(new BN(10000, 10)))) {
      console.log("Nuclear Egg");
      winningMint = "MYTHICAL" as models.IEggRarities;
    } else if (seed.lt(seedSpace.div(new BN(50, 10)))) {
      winningMint = "PURPLE" as models.IEggRarities;
    } else if (seed.lt(seedSpace.div(new BN(4, 10)))) {
      winningMint = "GREEN" as models.IEggRarities;
    } else {
      winningMint = "BLUE" as models.IEggRarities;
    }
  }
};

export const createRedeemTx = async (
  instructions: TransactionInstruction[],
  wallet: PublicKey,
  program: Program,
  winningMint: PublicKey,
  connection: Connection
) => {
  let [tokenAccount, _taNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), winningMint.toBuffer()],
    mints.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  let acctExists = await connection.getAccountInfo(tokenAccount);

  if (!acctExists) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        wallet,
        tokenAccount,
        wallet,
        winningMint
      )
    );
  }

  let [eggAuthAcct, authNonce] = await PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    program.programId
  );
  let [incubator, incubatorNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer()],
    program.programId
  );

  instructions.push(
    program.instruction.claimEggNft(incubatorNonce, authNonce, {
      accounts: {
        owner: wallet,
        incubator: incubator,
        slotHashes: mints.SLOT_HASHES_SYSVAR,
        feeAccount: mints.FEE_ACCT,
        eggNftMint: winningMint,
        eggNftTokenAccount: tokenAccount,
        eggNftAuth: eggAuthAcct,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: mints.SYSTEM_PROGRAM_ID,
      },
    })
  );
};

export const createRedeemTxD = async (
  wallet: PublicKey,
  program: Program,
  winningMint: PublicKey,
  connection: Connection
) => {
  let [tokenAccount, _taNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), winningMint.toBuffer()],
    mints.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  let acctExists = await connection.getAccountInfo(tokenAccount);

  let ix;
  if (!acctExists) {
    const cIx = createAssociatedTokenAccountInstruction(
      wallet,
      tokenAccount,
      wallet,
      winningMint
    );
    ix = [cIx];
  }

  let [eggAuthAcct, authNonce] = await PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    program.programId
  );
  let [incubator, incubatorNonce] = await PublicKey.findProgramAddress(
    [wallet.toBuffer()],
    program.programId
  );

  let tx = program.transaction.claimEggNft(incubatorNonce, authNonce, {
    accounts: {
      owner: wallet,
      incubator: incubator,
      slotHashes: mints.SLOT_HASHES_SYSVAR,
      feeAccount: mints.FEE_ACCT,
      eggNftMint: winningMint,
      eggNftTokenAccount: tokenAccount,
      eggNftAuth: eggAuthAcct,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: mints.SYSTEM_PROGRAM_ID,
    },
    instructions: ix,
  });
  return tx;
};
