
const anchor = require("@project-serum/anchor");
const { Keypair } = require("@solana/web3.js");

module.exports = async function (provider) {

  anchor.setProvider(provider);
  const program = anchor.workspace.Hatch;

  console.log('wallet', provider.wallet.publicKey.toString());
  console.log('program.programId', program.programId.toString());

  await program.methods.initClaimMask().rpc();

  // // FIRST
  // await program.methods
  //   .beginHatch()
  //   .accounts({
  //     eggNftAcct: new anchor.web3.PublicKey("A4komPKMMQmWd5FqJamvj6cpS9DCn8oC16ii8Gbu4LNx"),
  //     eggNftMint: new anchor.web3.PublicKey("2mwxSoxCFPpbxqwhiqzczMAv1YveKdc2JdRqPA1jLKhy"),
  //   })
  //   .rpc();
  // console.log("created hatcher");


  // //WAIT


  // // Create the assign winning hash ix
  // const assignIx = await program.methods
  //   .assignWinningHash()
  //   .accounts({
  //     hatcher: anchor.utils.publicKey.findProgramAddressSync([provider.wallet.publicKey.toBuffer()], program.programId)[0],
  //     slotHashes: new anchor.web3.PublicKey("SysvarS1otHashes111111111111111111111111111"),
  //   })
  //   .instruction();

  //Run the getWinningIndex ix with the assign ix as a pre instruction as a VIEW (returns an int)
  // const idx = await program.view
  //   .getWinningIndex({
  //     accounts: {
  //       hatcher: new anchor.web3.PublicKey("8k7GVpH5WirGpPvJfR2ay9rtRi1pMKgx4UbKu1TnByQi"),//anchor.utils.publicKey.findProgramAddressSync([provider.wallet.publicKey.toBuffer()], program.programId),
        
  //     },
  //     preInstructions: [assignIx],
  //   });
  // console.log(`index to claim is ${idx}`);


  // //build the claim instruction
  // const mint = Keypair.generate();
  // const dinoMetadataAccount = anchor.utils.publicKey.findProgramAddressSync(
  //   [
  //     Buffer.from("metadata"),
  //     new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
  //     mint.publicKey.toBuffer()
  //   ], 
  //   new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
  // )[0];
  // const dinoTokenAccount = await anchor.utils.token.associatedAddress({mint: mint.publicKey, owner:provider.wallet.publicKey});
  // await program.methods
  //   .claimDino(
  //     //use index returned above to look this up
  //     "YfNxJkoF_93yWUvQXkrOm0QqZO-EgEuCAUYSm-oL60U", //leave off "https://arweave.net/""
  //     "4532", //leave off "SolanaDINO Genesis Era #"",
  //     ["CPKY29xWNtaTfSmIkNak4A==","XekhJ3ii0nySUvuCgCZo5A==","cgNux6B97AXvnbk62cI+9w==","D2UPL5qPV7m1OkCDOD+ZDw==","B1VG0Z6QntNp2tF6k4eaUw==","ncLU1gha2VRiNMj6jDl1vw==","kgejqS9qbZONWeCJ14DF2g==","I/EW5dnwDEhmUAY+yxSTDg==","0TGXIexsJE3azMWt1RCfhw==","RAleaOXYKtWeSQR12t+T6Q==","uO612zDu7HOY3AMTFb2iGg==","pRaIMMmLIuOmLw5rgz1sfQ==","7nL73z08Oc/SAfRxTePx4w==","CZZR0Bnoi5kDhX2soA6Xtg=="]
  //       .map(a=>Buffer.from(a, "base64")),
  //   )
  //   .accounts({
  //     feeAccount: new anchor.web3.PublicKey("FEes6DWHdanTJndiHjivUF3rtAaGcuSgtBb56Mb9aV2W"),
  //     dinoMint: mint.publicKey,
  //     dinoMetadataAccount,
  //     dinoTokenAccount,
  //     //fine to hard code these
  //     metadataProgram: new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  //     collectionMint: new anchor.web3.PublicKey("DS1HUpxYUgySgNf1L6qzKNyU8akoKDahxhuiGkV4y7Vs"),
  //     collectionMetadata: new anchor.web3.PublicKey("B6czFPKghvbntrYmHXiFWAyXh9fXHwEazZPXoshMJCiF"),
  //     collectionMasterEdition: new anchor.web3.PublicKey("6ANFNf5pG9FRsXX6Br69LxzDRDS5RfyGT2RK7qPG53RW"),
  //     collectionAuthorityRecord: new anchor.web3.PublicKey("5gaJrn9zV8moJfUHMJzsCCwEo8HvoquTfQzZWKRD6n9j"),
  //   })
  //   .preInstructions([assignIx])
  //   .signers([
  //     mint,
  //   ])
  //   .rpc();

  //NOTE: if this claim dino fails, not sure what the problem is, but you want to make sure the 
  //assignIx runs at least, so on failure, submit just the assignIx by itself.  That will at least
  //get the users random number assigned so it is no longer time sensitive


  //example of just running the assign to commit it. this can never fail and doesn't even have to be signed
  //because anyone can crank the winning assignment. if already assigned it completes silently
  // await program.methods
  // .assignWinningHash()
  // .accounts({
  //   hatcher: anchor.utils.publicKey.findProgramAddressSync([provider.wallet.publicKey.toBuffer()], program.programId)[0],
  //   slotHashes: new anchor.web3.PublicKey("SysvarS1otHashes111111111111111111111111111"),
  // })
  // .rpc();

  //then you can try the claim ix by itself later

}
