const anchor = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, Token } = require("@solana/spl-token");

const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey("11111111111111111111111111111111");
const SLOT_HASHES_SYSVAR = new anchor.web3.PublicKey("SysvarS1otHashes111111111111111111111111111");
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

//mainnet
// const FEE_ACCT = new anchor.web3.PublicKey("DH2d5v6JHYo2X4a4dGuNBkW6AKmDGn3tHSHVsgVw34Kf");
// const EGG_MINT = new anchor.web3.PublicKey("2TxM6S3ZozrBHZGHEPh9CtM74a9SVXbr7NQ7UxkRvQij");
// const NFT1 = new anchor.web3.PublicKey("eg1eYgBvSLWZXor8VD1YA1DhYsbcCLURZEcFsYr52Vo");
// const NFT2 = new anchor.web3.PublicKey("eg2QbDMzUi9F8R3SsW9rnRCg9bEGCs1hGvhS5PfVQTe");
// const NFT3 = new anchor.web3.PublicKey("eg3mb8qBFwSdqL5Jrn8h5naeMgkxqA2YruJsEfCgcHL");
// const NFT4 = new anchor.web3.PublicKey("eg4GpXB99xuFzH2ezsbi8YAmWHwL79GLLK8CrxWixjY");

//testnet
const FEE_ACCT = new anchor.web3.PublicKey("FEes6DWHdanTJndiHjivUF3rtAaGcuSgtBb56Mb9aV2W");
const EGG_MINT = new anchor.web3.PublicKey("2TxM6S3ZozrBHZGHEPh9CtM74a9SVXbr7NQ7UxkRvQij");
const NFT1 = new anchor.web3.PublicKey("eg1eYgBvSLWZXor8VD1YA1DhYsbcCLURZEcFsYr52Vo");
const NFT2 = new anchor.web3.PublicKey("eg2QbDMzUi9F8R3SsW9rnRCg9bEGCs1hGvhS5PfVQTe");
const NFT3 = new anchor.web3.PublicKey("eg3mb8qBFwSdqL5Jrn8h5naeMgkxqA2YruJsEfCgcHL");
const NFT4 = new anchor.web3.PublicKey("eg4GpXB99xuFzH2ezsbi8YAmWHwL79GLLK8CrxWixjY");

async function getPendingIncubator(program, wallet) {
    let [incubator, _incubatorNonce] = await anchor.web3.PublicKey.findProgramAddress([wallet.toBuffer()], program.programId);
    let iAcct = await program.account.incubator.fetchNullable(incubator);
    return iAcct;
}

async function createIncubatorTx(program, wallet, tokenAccount, amount) {
    let [incubator, incubatorNonce] = await anchor.web3.PublicKey.findProgramAddress([wallet.toBuffer()], program.programId);
    let tx = await program.transaction.beginCreate(
      incubatorNonce,
      new anchor.BN(amount),
      {
        accounts: {
          owner: wallet,
          incubator: incubator,
          eggAcct: tokenAccount,
          eggMint: EGG_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID
        }
      }
    );
    return tx;
}

async function getWinningMint(iAcct, connection) {
    const slot = parseInt(iAcct.slot.toString()) + 6;
    let found = false;
    let winner;
    while (true) {
      const hashesAccount = await connection.getAccountInfo(SLOT_HASHES_SYSVAR);
      const slotHashes = getSlotHashes(hashesAccount);

      let counter = 0;
      let maybeWinner = [-1, undefined];
      for (sh of slotHashes) {
        if (sh[0] + 1 == maybeWinner[0]) {
          winner = maybeWinner;
        }

        if (sh[0] <= slot) {
          found = true;
          break;
        }

        maybeWinner = sh;
        counter++;
      }
      if (found && winner) {
        break;
      }
      if (counter > 150) {
        //waited too long
        break;
      }
      await sleep(2000);
    }
    
    let winningMint;
    if (!found || !winner) {
      winningMint = NFT1;
    } else {
      const blockhashBytes = anchor.utils.bytes.bs58.decode(winner[1]);

      let seed = new anchor.BN(blockhashBytes.slice(12, 20), 10, 'le')
        .mul(new anchor.BN(1000000, 10));
      const seedSpace = new anchor.BN(2, 10)
        .pow(new anchor.BN(64, 10))
        .sub(new anchor.BN(1, 10))
        .mul(iAcct.amountBurned);

      if (seed.lt(seedSpace.div(new anchor.BN(10000, 10)))) {
        winningMint = NFT4;
      } else if (seed.lt(seedSpace.div(new anchor.BN(50, 10)))) {
        winningMint = NFT3;
      } else if (seed.lt(seedSpace.div(new anchor.BN(4, 10)))) {
        winningMint = NFT2;
      } else {
        winningMint = NFT1;
      }
    }
    return winningMint;
}

async function createRedeemTx(wallet, program, winningMint, connection) {
    let [tokenAccount, _taNonce] = await anchor.web3.PublicKey.findProgramAddress([wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), winningMint.toBuffer() ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID);
    let acctExists = await connection.getAccountInfo(tokenAccount);

    let ix;
    if (!acctExists) {
      const cIx = Token.createAssociatedTokenAccountInstruction(
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        winningMint,
        tokenAccount,
        wallet,
        wallet,
      );
      ix = [cIx];
    }

    let [eggAuthAcct, authNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("mint")], program.programId);
    let [incubator, incubatorNonce] = await anchor.web3.PublicKey.findProgramAddress([wallet.toBuffer()], program.programId);

    let tx = await program.transaction.claimEggNft(
      incubatorNonce,
      authNonce,
      {
        accounts: {
          owner: wallet,
          incubator: incubator,
          slotHashes: SLOT_HASHES_SYSVAR,
          feeAccount: FEE_ACCT,
          eggNftMint: winningMint,
          eggNftTokenAccount: tokenAccount,
          eggNftAuth: eggAuthAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID
        },
        instructions: ix
      }
    );
    return tx;
}

function* getSlotHashes(account) {
  let len = new anchor.BN(account.data.slice(0, 8), 'le').toNumber();
  let i = 0;
  while (i < len) {
    yield [
      new anchor.BN(account.data.slice(8+(i*40), 8+(i*40)+8), 'le').toNumber(),
      anchor.utils.bytes.bs58.encode(account.data.slice(8+(i*40)+8, 8+(i*40)+40))
    ];
    i++;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { getPendingIncubator, createIncubatorTx, getWinningMint, createRedeemTx }