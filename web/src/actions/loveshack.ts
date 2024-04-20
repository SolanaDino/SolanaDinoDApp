import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "../utils/ids";
import * as anchor from "@project-serum/anchor";
import * as actions from "actions";
import * as models from "models";

import {
  DINO_MINT,
  EGG_MINT,
  RENT_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  CLOCK_PROGRAM_ID,
  DINO_RAYDIUMLP_MINT,
  DINO_STEPLP_MINT,
} from "../consts/mints";

export function createStakingAccountInstruction(
  instructions: web3.TransactionInstruction[],
  program: anchor.Program,
  owner: web3.PublicKey,
  stakeAcct: web3.PublicKey
) {
  instructions.push(
    program.instruction.initStakingAccountsV2({
      accounts: {
        owner: owner,
        aMint: DINO_MINT,
        bMint: EGG_MINT,
        stakeV2: stakeAcct,
        rent: RENT_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    })
  );
  return;
}

export const ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export function createMigrateTokensInstruction(
  instructions: web3.TransactionInstruction[],
  groupedTokenAccounts: Map<string, models.ISplAccounts[]>,
  ataMap: Map<string, models.ITokenAccount>,
  owner: web3.PublicKey,
  signers: web3.Account[],
  mint?: web3.PublicKey
) {
  const mergeableList = mint
    ? [mint.toString()]
    : Array.from(groupedTokenAccounts.keys());

  mergeableList.forEach((key) => {
    const ataInfo = ataMap.get(key);
    const auxAccts = groupedTokenAccounts.get(key);

    if (!auxAccts || !ataInfo) {
      return;
    }

    if (!ataInfo.ataInfo) {
      instructions.push(
        actions.createAtaInstruction(
          new web3.PublicKey(ataInfo.pubkey),
          owner,
          new web3.PublicKey(key)
        )
      );
    }

    auxAccts.forEach((auxAcct) => {
      instructions.push(
        spl.createTransferInstruction(
          auxAcct.pubkey,
          new web3.PublicKey(ataInfo.pubkey),
          owner,
          auxAcct.account.data.parsed.info.tokenAmount.amount,
          signers
        )
      );

      instructions.push(
        spl.createCloseAccountInstruction(
          new web3.PublicKey(auxAcct.pubkey),
          new web3.PublicKey(ataInfo.pubkey),
          owner,
          signers
        )
      );
    });
  });
  return;
}

export function createStakeDinoInstruction(
  instructions: web3.TransactionInstruction[],
  program: anchor.Program,
  owner: web3.PublicKey,
  ataDino: web3.PublicKey,
  stakeAcct: web3.PublicKey,
  holdingAcct: web3.PublicKey,
  aMint: web3.PublicKey,
  amount: number,
  decimals: number
) {
  instructions.push(
    program.instruction.putStakeDinoForEgg(
      new anchor.BN(amount * Math.pow(10, decimals)),
      {
        accounts: {
          owner: owner,
          aMint: DINO_MINT,
          bMint: EGG_MINT,
          from: ataDino,
          stake: stakeAcct,
          holding: holdingAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      }
    )
  );
  return;
}

export function getStakeDinoInstruction(
  instructions: web3.TransactionInstruction[],
  program: anchor.Program,
  owner: web3.PublicKey,
  ata: web3.PublicKey,
  stakeAcct: web3.PublicKey,
  holdingAcct: web3.PublicKey,
  aMint: web3.PublicKey,
  amount: number,
  decimals: number
) {
  instructions.push(
    program.instruction.getStakeDinoForEgg(
      new anchor.BN(amount * Math.pow(10, decimals)),
      {
        accounts: {
          owner: owner,
          aMint: DINO_MINT,
          bMint: EGG_MINT,
          to: ata,
          stake: stakeAcct,
          holding: holdingAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      }
    )
  );
  return;
}

export function addAtaInstruction(
  instructions: web3.TransactionInstruction[],
  ata: web3.PublicKey,
  owner: web3.PublicKey,
  mint: web3.PublicKey
) {
  instructions.push(actions.createAtaInstruction(ata, owner, mint));
}

export function claimEggInstruction(
  instructions: web3.TransactionInstruction[],
  program: anchor.Program,
  owner: web3.PublicKey,
  ataEgg: web3.PublicKey,
  stakeAcct: web3.PublicKey,
  eggAuthAcct: web3.PublicKey
) {
  instructions.push(
    program.instruction.claimEggFromDino({
      accounts: {
        owner: owner,
        aMint: DINO_MINT,
        bMint: EGG_MINT,
        to: ataEgg,
        stake: stakeAcct,
        authority: eggAuthAcct,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    })
  );
  return;
}

export function createMigrateStakingAcctsInstruction(
  instructions: web3.TransactionInstruction[],
  program: anchor.Program,
  owner: web3.PublicKey,
  stakeAcctV1: web3.PublicKey,
  stakeAcctV2: web3.PublicKey
) {
  instructions.push(
    program.instruction.migrateStakingAccountV1V2({
      accounts: {
        owner: owner,
        payer: owner,
        aMint: DINO_MINT,
        bMint: EGG_MINT,
        stake: stakeAcctV1,
        stakeV2: stakeAcctV2,
        rent: RENT_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    })
  );
  return;
}
