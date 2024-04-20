import * as spl from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import * as models from "models";

export async function getAssociatedTokenAccount(
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  connection: web3.Connection
) {
  const ata = await spl.getAssociatedTokenAddress(mint, owner);

  const ataInfo = (
    await connection.getParsedAccountInfo(new web3.PublicKey(ata), "confirmed")
  ).value?.data as models.IParsedTokenAccount;

  return {
    pubkey: ata.toString(),
    ataInfo,
  } as models.ITokenAccount;
}

export function createAtaInstruction(
  ata: web3.PublicKey,
  owner: web3.PublicKey,
  mint: web3.PublicKey
) {
  return spl.createAssociatedTokenAccountInstruction(owner, ata, owner, mint);
}

export async function generateTransactionNew(
  wallet: web3.PublicKey | null,
  instructions: web3.TransactionInstruction[]
) {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }

  let transaction = new web3.Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.feePayer = wallet;

  return transaction;
}

export async function generateTransaction(
  connection: web3.Connection,
  wallet: web3.PublicKey | null,
  instructions: web3.TransactionInstruction[],
  signers: web3.Keypair[]
) {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }

  let transaction = new web3.Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;
  transaction.setSigners(
    // fee payied by the wallet owner
    wallet,
    ...signers.map((s) => s.publicKey)
  );
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  return transaction;
}
