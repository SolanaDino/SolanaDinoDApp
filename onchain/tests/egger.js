const fs = require('fs')
const anchor = require('@project-serum/anchor');
const assert = require("assert");
const { TOKEN_PROGRAM_ID, Token, MintLayout } = require("@solana/spl-token");

const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey("11111111111111111111111111111111");
const RENT_PROGRAM_ID = new anchor.web3.PublicKey("SysvarRent111111111111111111111111111111111");
const CLOCK_PROGRAM_ID = new anchor.web3.PublicKey("SysvarC1ock11111111111111111111111111111111");
const SLOT_HASHES_SYSVAR = new anchor.web3.PublicKey("SysvarS1otHashes111111111111111111111111111");
const RECENT_BLOCKHASHES_SYSVAR = new anchor.web3.PublicKey("SysvarRecentB1ockHashes11111111111111111111");
const SLOT_HISTORY_SYSVAR = new anchor.web3.PublicKey("SysvarS1otHistory11111111111111111111111111");

const EGG_AMOUNT = 3999999;

describe('egger', () => {

  let provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Egger;

  let mintEgg = null;
  let eggTokenAcct = null;
  let authAcct = null;
  let authNonce = null;
  
  let mintEggNft1 = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('./tests/keys/eg1k5KLd4cua24z9SwtgvXtEo2m71REm5UTMh6h59N7.json', 'utf8'))));
  let mintEggNft2 = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('./tests/keys/eg2Yh8qERksv7ZyLuaFtUf1JJo27527zmdeWyaSmrbi.json', 'utf8'))));
  let mintEggNft3 = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('./tests/keys/eg37hy9sJqM4AyKAq8ENCQgXwYcZ8Cxrha4gian1wAb.json', 'utf8'))));
  let mintEggNft4 = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('./tests/keys/eg4koobagieinnTzqsjGnPu5akSr51fKUVfdZPdqS6z.json', 'utf8'))));

  let initialEgg = 5_000_000_000;

  //for creating mint
  const payer = anchor.web3.Keypair.generate();

  it("Initializes test state", async () => {
    // Airdropping sol to a payer to create a mint.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    mintEgg = await Token.createMint(
      provider.connection,
      payer,
      payer.publicKey, //temp
      null,
      6,
      TOKEN_PROGRAM_ID
    );
    
    //create a token account
    eggTokenAcct = await mintEgg.createAccount(payer.publicKey);

    //mint initial tokens
    await mintEgg.mintTo(
      eggTokenAcct,
      payer,
      [],
      initialEgg
    );

    [authAcct, authNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("mint")], program.programId);
    console.log('authAcct', authAcct.toString());

    await createMint(
      provider.connection,
      mintEggNft1,
      payer,
      authAcct,
      null,
      0
    );

    await createMint(
      provider.connection,
      mintEggNft2,
      payer,
      authAcct,
      null,
      0
    );

    await createMint(
      provider.connection,
      mintEggNft3,
      payer,
      authAcct,
      null,
      0
    );

    await createMint(
      provider.connection,
      mintEggNft4,
      payer,
      authAcct,
      null,
      0
    );
    
  });

  it('begin create', async () => {
    let [incubator, incubatorNonce] = await anchor.web3.PublicKey.findProgramAddress([payer.publicKey.toBuffer()], program.programId);

    console.log('incubator',incubator.toString());

    const tx = await program.rpc.beginCreate(
      incubatorNonce,
      new anchor.BN(EGG_AMOUNT),
      { 
        accounts: {
          owner: payer.publicKey,
          incubator: incubator,
          eggAcct: eggTokenAcct,
          slotHashes: SLOT_HASHES_SYSVAR,
          recentBlockhashes: RECENT_BLOCKHASHES_SYSVAR,
          eggMint: mintEgg.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
        signers: [ payer ],
      }
    );
  });

  let winningMint;
  let winningAccount;

  it('compute winning mint', async () => {
    const [incubator, _nonce] = await anchor.web3.PublicKey.findProgramAddress([payer.publicKey.toBuffer()], program.programId);
    const iAcct = await program.account.incubator.fetch(incubator);
    const slot = parseInt(iAcct.priorSlot.toString()) + 6;
    console.log('waiting for slot', slot);
    let winningSlot;
    do {
      const confirmedSlots = await provider.connection.getBlocks(slot, slot + 512, `confirmed`);
      console.log('got slots', confirmedSlots);
      
      if (confirmedSlots.length <= 1) {
        await sleep(2000);
        continue;
      }

      for(let i = 0; i < confirmedSlots.length - 1; i++) {
        
        const blockTemp = await provider.connection.getBlock(confirmedSlots[i], {commitment:'confirmed'});
        console.log('slot', confirmedSlots[i], 'block', blockTemp.blockhash.toString());

        if (confirmedSlots[i] + 1 == confirmedSlots[i + 1]) {
          winningSlot = confirmedSlots[i] + 1;
          break;
        }
      }
    } while (!winningSlot);
    console.log('winning slot', winningSlot);

    const block = await provider.connection.getBlock(winningSlot, {commitment:'confirmed'});
    console.log('blockhash', block.blockhash.toString());
    
    const blockhashBytes = anchor.utils.bytes.bs58.decode(block.blockhash);
    console.log('blockhashBytes',blockhashBytes)

    let seed = new anchor.BN(blockhashBytes.slice(12, 20), 10, 'le')
      .mul(new anchor.BN(1000000, 10));
    console.log('seed', seed.toString());

    const seedSpace = new anchor.BN(2, 10)
      .pow(new anchor.BN(64, 10))
      .sub(new anchor.BN(1, 10))
      .mul(new anchor.BN(EGG_AMOUNT, 10));
    console.log('seedSpace', seedSpace.toString());

    if (seed.lt(seedSpace.div(new anchor.BN(10000, 10)))) {
      console.log("Nuclear Egg");
      winningMint = mintEggNft4;
    } else if (seed.lt(seedSpace.div(new anchor.BN(50, 10)))) {
      console.log("Purple Egg");
      winningMint = mintEggNft3;
    } else if (seed.lt(seedSpace.div(new anchor.BN(4, 10)))) {
      console.log("Green Egg");
      winningMint = mintEggNft2;
    } else {
      console.log("Blue Egg");
      winningMint = mintEggNft1;
    }
  
  });

  it('claim egg nft', async () => {
    [incubator, nonce] = await anchor.web3.PublicKey.findProgramAddress([payer.publicKey.toBuffer()], program.programId);

    let t = new Token(
      provider.connection,
      winningMint.publicKey,
      new anchor.web3.PublicKey(TOKEN_PROGRAM_ID),
      payer
    );
    winningAccount = await t.createAccount(payer.publicKey);

    const tx = await program.rpc.claimEggNft(
      nonce,
      authNonce,
      { 
        accounts: {
          owner: payer.publicKey,
          incubator: incubator,
          slotHashes: SLOT_HASHES_SYSVAR,
          recentBlockhashes: RECENT_BLOCKHASHES_SYSVAR,
          feeAccount: payer.publicKey,
          eggNftMint: winningMint.publicKey,
          eggNftTokenAccount: winningAccount,
          eggNftAuth: authAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
        signers: [ payer ],
      }
    );
  });

  it('second claim egg nft fail', async () => {
    [incubator, nonce] = await anchor.web3.PublicKey.findProgramAddress([payer.publicKey.toBuffer()], program.programId);

    try {
      const tx = await program.rpc.claimEggNft(
        nonce,
        authNonce,
        { 
          accounts: {
            owner: payer.publicKey,
            incubator: incubator,
            slotHashes: SLOT_HASHES_SYSVAR,
            recentBlockhashes: RECENT_BLOCKHASHES_SYSVAR,
            feeAccount: payer.publicKey,

            //wrong
            eggNftMint: mintEggNft1.publicKey,
            eggNftTokenAccount: eggNftTokenAcct1,

            eggNftAuth: authAcct,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SYSTEM_PROGRAM_ID,
          },
          signers: [ payer ],
        }
      );
      assert(false, "second claim did not fail")
    } catch { }
  });

});

function delay(interval) 
{
   return it('should delay', done => 
   {
      setTimeout(() => done(), interval)

   }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createMint(
  connection,
  mintAccount,
  payer,
  mintAuthority,
  freezeAuthority,
  decimals
) {
  const tokenProgram = new anchor.web3.PublicKey(TOKEN_PROGRAM_ID); 

  const token = new Token(
    connection,
    mintAccount.publicKey,
    tokenProgram,
    payer,
  );

  // Allocate memory for the account
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(
    connection,
  );

  const transaction = new anchor.web3.Transaction();
  transaction.add(
      anchor.web3.SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintAccount.publicKey,
          lamports: new anchor.BN(balanceNeeded),
          space: new anchor.BN(MintLayout.span),
          programId: tokenProgram,
      }),
  );

  transaction.add(
    Token.createInitMintInstruction(
      tokenProgram,
      mintAccount.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
    ),
  );

  // Send the two instructions
  await anchor.web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer,mintAccount],
  );

  return token;
}
