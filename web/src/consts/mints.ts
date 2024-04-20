import { PublicKey } from "@solana/web3.js";

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const DINO_MINT_TEST = new PublicKey(
  "6NP2WoZFUQ8faBdDLvX74CWj76MVUyba3gRQVAkSNZDv"
);
const DINO_MINT_DEV = new PublicKey(
  "9Nxqv8r9n7eaxL2vjjjAvPYSXnqtj3joxGRHxuPSQX1z"
);
const DINO_MINT_MAIN = new PublicKey(
  "6Y7LbYB3tfGBG6CSkyssoxdtHb77AEMTRVXe8JUJRwZ7"
);

const EGG_MINT_TEST = new PublicKey(
  "EEzkwtCfEUR1kxdvMwrnY3UDWKsuLLRK3QppACVpvWqD"
);
const EGG_MINT_DEV = new PublicKey(
  "Habd744B4vkz5Q1ogT2UhT4d8PtNrmDawVtjvLVvMdEU"
);
const EGG_MINT_MAIN = new PublicKey(
  "2TxM6S3ZozrBHZGHEPh9CtM74a9SVXbr7NQ7UxkRvQij"
);

const DINO_RAYDIUMLP_MINT_TEST = new PublicKey(
  "58USjuQKpinuZCS5ZoxScJhXfDuoM9ziNDdUaMrRcb1a"
);

const DINO_RAYDIUMLP_MINT_DEV = new PublicKey(
  "FP24HnJLXScWCp73u8E7cpqyuRzQFw87nkQwkRNUPXJ8"
);
const DINO_RAYDIUMLP_MINT_MAIN = new PublicKey(
  "BVctoQkpesBMWggrzoqrJh9V4iBa7qMaPczSXZ2yuFjG"
);

const DINO_STEPLP_MINT_TEST = new PublicKey(
  "7bHzFXzA8JWqaNQpwFJqjNJwySQMipZeEkn7fyAYt1yK"
);
const DINO_STEPLP_MINT_DEV = new PublicKey(
  "632FvbnWmeBM7t5CqLu94qKmDHZuQ96CZEm18UhYEeY5"
);
const DINO_STEPLP_MINT_MAIN = new PublicKey(
  "3g3MD3wtLi4SrYm3VMmDqsb5k8wsMc3jF3ojvzkY6yM7"
);

export const FEE_ACCT = new PublicKey(
  "FEes6DWHdanTJndiHjivUF3rtAaGcuSgtBb56Mb9aV2W"
);
// const EGG_MINT = new anchor.web3.PublicKey("2TxM6S3ZozrBHZGHEPh9CtM74a9SVXbr7NQ7UxkRvQij");
export const NFT1 = new PublicKey(
  "eg1eYgBvSLWZXor8VD1YA1DhYsbcCLURZEcFsYr52Vo"
);
export const NFT2 = new PublicKey(
  "eg2QbDMzUi9F8R3SsW9rnRCg9bEGCs1hGvhS5PfVQTe"
);
export const NFT3 = new PublicKey(
  "eg3mb8qBFwSdqL5Jrn8h5naeMgkxqA2YruJsEfCgcHL" // 2mwxSoxCFPpbxqwhiqzczMAv1YveKdc2JdRqPA1jLKhy eg3mb8qBFwSdqL5Jrn8h5naeMgkxqA2YruJsEfCgcHL
);
export const NFT4 = new PublicKey(
  "eg4GpXB99xuFzH2ezsbi8YAmWHwL79GLLK8CrxWixjY"
);

const LS_PROGRAM_ID_MAIN = new PublicKey(
  "RAWRbJtj6gnQhC13v4VUPY3LxkwAiDXuH42uaR38ywf"
);
const LS_PROGRAM_ID_TEST = new PublicKey(
  "RAWRbJtj6gnQhC13v4VUPY3LxkwAiDXuH42uaR38ywf"
);
const LS_PROGRAM_ID_DEV = new PublicKey(
  "DinoMnEFnBu7j9ajpoMEqrLTRiBFhmCzorHKPXNrnVSx"
);

const INCUBATOR_PROGRAM_ID_MAIN = new PublicKey(
  "eggLYZtrPdTdkwPFWcQL8qq7QM4AvXKtYBH2KK7gmxC"
);

const HATCHER_PROGRAM_ID_DEV = new PublicKey(
  "HAtcHcNADtwriNaXzkLqMjANDxKSV9Zy5MK2m9kiYzCS"
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111"
);
export const RENT_PROGRAM_ID = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
);
export const CLOCK_PROGRAM_ID = new PublicKey(
  "SysvarC1ock11111111111111111111111111111111"
);
export const SLOT_HASHES_SYSVAR = new PublicKey(
  "SysvarS1otHashes111111111111111111111111111"
);
export const RECENT_BLOCKHASHES_SYSVAR = new PublicKey(
  "SysvarRecentB1ockHashes11111111111111111111"
);

export const LS_PROGRAM_ID = LS_PROGRAM_ID_MAIN;
export const INCUBATOR_PROGRAM_ID = INCUBATOR_PROGRAM_ID_MAIN;
export const HATCHER_PROGRAM_ID = HATCHER_PROGRAM_ID_DEV;
export const DINO_MINT = DINO_MINT_MAIN;
export const EGG_MINT = EGG_MINT_MAIN;
export const DINO_RAYDIUMLP_MINT = DINO_RAYDIUMLP_MINT_MAIN;
export const DINO_STEPLP_MINT = DINO_STEPLP_MINT_MAIN;
export const TOKEN_LIST = [
  DINO_MINT,
  EGG_MINT,
  DINO_RAYDIUMLP_MINT,
  DINO_STEPLP_MINT,
  NFT1,
  NFT2,
  NFT3,
  NFT4,
];
