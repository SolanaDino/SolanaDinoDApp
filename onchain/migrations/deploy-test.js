
const anchor = require("@project-serum/anchor");
const { Keypair } = require("@solana/web3.js");

module.exports = async function (provider) {

  anchor.setProvider(provider);
  const program = anchor.workspace.Dino;

  console.log('wallet', provider.wallet.publicKey.toString());
  console.log('program.programId', program.programId.toString());



}
