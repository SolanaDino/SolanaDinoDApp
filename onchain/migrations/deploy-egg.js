
const anchor = require("@project-serum/anchor");
const { Creator, MetadataDataData, CreateMetadata, UpdateMetadata, Metadata } = require("@metaplex-foundation/mpl-token-metadata");

const { getPendingIncubator, createIncubatorTx, getWinningMint, createRedeemTx } = require("./egger-lib.js");

const EGG_AMOUNT = 1000000;

const NFT1 = new anchor.web3.PublicKey("eg1eYgBvSLWZXor8VD1YA1DhYsbcCLURZEcFsYr52Vo");
const NFT2 = new anchor.web3.PublicKey("eg2QbDMzUi9F8R3SsW9rnRCg9bEGCs1hGvhS5PfVQTe");
const NFT3 = new anchor.web3.PublicKey("eg3mb8qBFwSdqL5Jrn8h5naeMgkxqA2YruJsEfCgcHL");
const NFT4 = new anchor.web3.PublicKey("eg4GpXB99xuFzH2ezsbi8YAmWHwL79GLLK8CrxWixjY");

module.exports = async function (provider) {

  anchor.setProvider(provider);
  const program = anchor.workspace.Egger;

  console.log('wallet', provider.wallet.publicKey.toString());
  console.log('program.programId', program.programId.toString());

  await eggLoop(program, provider);

  //await createMetaplexData(provider);

}

async function createMetaplexData(provider) {
  const metadataData = new MetadataDataData({
    name: 'Dino Egg Mutation',
    symbol: 'DINOENFT4',
    uri: "https://arweave.net/gXq0yfA6OnZw7TAg519UjpdDTvD1pq1G5R1QJEcVVGA",
    sellerFeeBasisPoints: 500,
    creators: [
      new Creator({
        address: provider.wallet.publicKey.toBase58(),
        verified: true,
        share: 100,
      }),
    ],
  });

  const metadata = await Metadata.getPDA(NFT4);

  let createMetadataTx;
  
  createMetadataTx = new CreateMetadata(
    { feePayer: provider.wallet.publicKey },
    {
      metadata,
      metadataData,
      updateAuthority: provider.wallet.publicKey,
      mint: NFT4,
      mintAuthority: provider.wallet.publicKey,
    },
  );

  await provider.send(createMetadataTx);

  createMetadataTx = new UpdateMetadata(
    { feePayer: provider.wallet.publicKey },
    {
      metadata,
      metadataData,
      updateAuthority: provider.wallet.publicKey,
      newUpdateAuthority: provider.wallet.publicKey,
      primarySaleHappened: true
    },
  );

  await provider.send(createMetadataTx);
}

async function eggLoop(program, provider) {
  //devnet
  //let eggTokenAccount = new anchor.web3.PublicKey('6meyaMZ5FdXftFwKUbLi5Bp3GL1Bzodq4ebt7uHigCSk');
  //testnet
  //let eggTokenAccount = new anchor.web3.PublicKey('w4TeYtBCApYCpk44QNpCMy8yswhneYU2LXmKYmBnU3M');
  //test payer
  let eggTokenAccount = new anchor.web3.PublicKey('9J7VZ817g8FaM2ERR5BeHn2jYwF39VWhwY3gdWF5on6C');

  try {
    let iAcct = await getPendingIncubator(program, provider.wallet.publicKey);
    if (!iAcct) {
      console.log('no incubator, creating');
      const tx = await createIncubatorTx(program, provider.wallet.publicKey, eggTokenAccount, EGG_AMOUNT);
      await provider.send(tx);
      console.log('sent incubator create');
      await sleep(1000);
      iAcct = await getPendingIncubator(program, provider.wallet.publicKey);
    }
    console.log('incubator ready, waiting for winning mint');
    const winningMint = await getWinningMint(iAcct, provider.connection);
    console.log('winning mint', winningMint.toString());
    const tx = await createRedeemTx(provider.wallet.publicKey, program, winningMint, provider.connection);
    console.log('redeeming');
    await provider.send(tx);
    console.log('complete');
  } catch (e) {
    console.error("err", e);
    //await sleep(5000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}