









//broken since v2 update











const anchor = require('@project-serum/anchor');
const assert = require("assert");
const serumCmn = require("@project-serum/common");
const { TOKEN_PROGRAM_ID, Token, AuthorityType } = require("@solana/spl-token");

const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey("11111111111111111111111111111111");
const RENT_PROGRAM_ID = new anchor.web3.PublicKey("SysvarRent111111111111111111111111111111111");
const CLOCK_PROGRAM_ID = new anchor.web3.PublicKey("SysvarC1ock11111111111111111111111111111111");

describe('dino', () => {
  
  
  
  
  return;




  let provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dino;

  let mintDino = null;
  let mintStepLP = null;
  let mintRaydiumLP = null;
  let mintEgg = null;

  let dinoTokenAcct = null;
  let stepLPTokenAcct = null;
  let raydiumLPTokenAcct = null;
  let eggTokenAcct = null;

  let stakeAcct = null;
  let stakeAcctV2 = null;
  let holdingAcct = null;
  let holdingStepLPAcct = null;
  let holdingRaydiumLPAcct = null;

  let eggAuthAcct = null;

  let initialDino = 90_000_000_000;
  let dinoToTestInAndOut = 15_00_000_000;
  let stepLPToTestInAndOut = 5_00_000_000;
  let raydiumLPToTestInAndOut = 5_00_000_000;

  //for creating mint
  const payer = anchor.web3.Keypair.generate();
  const dinoMintAuthority = anchor.web3.Keypair.generate();

  it("Initializes test state", async () => {
    // Airdropping sol to a payer to create a mint.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    mintDino = await Token.createMint(
      provider.connection,
      payer,
      dinoMintAuthority.publicKey,
      null,
      6,
      TOKEN_PROGRAM_ID
    );

    mintStepLP = await Token.createMint(
      provider.connection,
      payer,
      dinoMintAuthority.publicKey,
      null,
      6,
      TOKEN_PROGRAM_ID
    );

    mintRaydiumLP = await Token.createMint(
      provider.connection,
      payer,
      dinoMintAuthority.publicKey,
      null,
      6,
      TOKEN_PROGRAM_ID
    );

    mintEgg = await Token.createMint(
      provider.connection,
      payer,
      provider.wallet.publicKey, //temp
      null,
      6,
      TOKEN_PROGRAM_ID
    );
    
    //create a token accounts
    dinoTokenAcct = await mintDino.createAccount(provider.wallet.publicKey);
    stepLPTokenAcct = await mintStepLP.createAccount(provider.wallet.publicKey);
    raydiumLPTokenAcct = await mintRaydiumLP.createAccount(provider.wallet.publicKey);
    eggTokenAcct = await mintEgg.createAccount(provider.wallet.publicKey);

    //mint initial tokens
    await mintDino.mintTo(
      dinoTokenAcct,
      dinoMintAuthority.publicKey,
      [dinoMintAuthority],
      initialDino
    );
    var bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert(parseInt(bal.value.amount), initialDino);
    
    await mintStepLP.mintTo(
      stepLPTokenAcct,
      dinoMintAuthority.publicKey,
      [dinoMintAuthority],
      initialDino
    );
    bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert(parseInt(bal.value.amount), initialDino);
    
    await mintRaydiumLP.mintTo(
      raydiumLPTokenAcct,
      dinoMintAuthority.publicKey,
      [dinoMintAuthority],
      initialDino
    );
    bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert(parseInt(bal.value.amount), initialDino);

    [stakeAcct, _nonce] = await anchor.web3.PublicKey.findProgramAddress([provider.wallet.publicKey.toBuffer(), mintDino.publicKey.toBuffer(), mintEgg.publicKey.toBuffer()], program.programId);
    [stakeAcctV2, _nonce] = await anchor.web3.PublicKey.findProgramAddress([provider.wallet.publicKey.toBuffer(), mintEgg.publicKey.toBuffer(), mintDino.publicKey.toBuffer()], program.programId);

    [holdingAcct, _nonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("holding"), mintDino.publicKey.toBuffer()], program.programId);
    [holdingStepLPAcct, _nonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("holding"), mintStepLP.publicKey.toBuffer()], program.programId);
    [holdingRaydiumLPAcct, _nonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("holding"), mintRaydiumLP.publicKey.toBuffer()], program.programId);
    [eggAuthAcct, _nonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("minting"), mintEgg.publicKey.toBuffer()], program.programId);

  });

  //admins do this one time.
  //this sets the mint authority to the program, and creates the holding account (owned by program)
  it('inits holding and mint', async () => {
    const tx = await program.rpc.initHoldingAndMint({ 
      accounts: {
        payer: provider.wallet.publicKey,
        aMint: mintDino.publicKey,
        bMint: mintEgg.publicKey,
        holding: holdingAcct,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    });
  });

  //a user does this when initially interacting with the contract.
  //we should automatically send this instruction as part of their initial stake 
  //(if staking and their stake account does not exist - see stake account derivation above)
  //should only be sent once ever - will fail if called again
  it('init staking', async () => {
    await program.rpc.initStakingAccountsV2({ 
      accounts: {
        owner: provider.wallet.publicKey,
        aMint: mintDino.publicKey,
        bMint: mintEgg.publicKey,
        stake: stakeAcct,
        rent: RENT_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    });
  });

  //here is the staking call
  it('put stake dino for egg', async () => {
    var dinoBal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    var holdingBal = await provider.connection.getTokenAccountBalance(holdingAcct);
    dinoBal = parseInt(dinoBal.value.amount);
    holdingBal = parseInt(holdingBal.value.amount);

    var amt = dinoBal - dinoToTestInAndOut;

    const tx = await program.rpc.putStakeDinoForEgg(
      new anchor.BN(amt), 
      { 
        accounts: {
          owner: provider.wallet.publicKey,
          aMint: mintDino.publicKey,
          bMint: mintEgg.publicKey,
          from: dinoTokenAcct,
          stake: stakeAcct,
          holding: holdingAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      });

    var bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert.strictEqual(parseInt(bal.value.amount), dinoBal - amt);
    var bal = await provider.connection.getTokenAccountBalance(holdingAcct);
    assert.strictEqual(parseInt(bal.value.amount), holdingBal + amt);
    
    var s = await program.account.stakeAccount.fetch(stakeAcct)
    assert.strictEqual(s.aMintStaked.toNumber(), amt);
    assert.strictEqual(s.bMintEarned.toNumber(), 0);
  });
/*
  it('fail on too much get stake dino for egg', async () => {
    var dinoBal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    var holdingBal = await provider.connection.getTokenAccountBalance(holdingAcct);
    dinoBal = parseInt(dinoBal.value.amount);
    holdingBal = parseInt(holdingBal.value.amount);
    var stakeBefore = await program.account.stakeAccount.fetch(stakeAcct);

    var amt = holdingBal + 1;

    await assert.rejects(
      async () => {
        await program.rpc.getStakeDinoForEgg(
          new anchor.BN(amt), 
          { 
            accounts: {
              owner: provider.wallet.publicKey,
              aMint: mintDino.publicKey,
              bMint: mintEgg.publicKey,
              to: dinoTokenAcct,
              stake: stakeAcct,
              holding: holdingAcct,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: RENT_PROGRAM_ID,
              clock: CLOCK_PROGRAM_ID,
              systemProgram: SYSTEM_PROGRAM_ID,
            },
          }
        );
      }
    );

    var bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert.strictEqual(parseInt(bal.value.amount), dinoBal);
    bal = await provider.connection.getTokenAccountBalance(holdingAcct);
    assert.strictEqual(parseInt(bal.value.amount), holdingBal);
    
    var s = await program.account.stakeAccount.fetch(stakeAcct)
    assert.strictEqual(s.aMintStaked.toNumber(), stakeBefore.aMintStaked.toNumber());
    assert.strictEqual(s.bMintEarned.toNumber(), stakeBefore.bMintEarned.toNumber());
  });

  delay(10000);

  //this is removing some of the stake, which the interface should support
  it('get stake dino for egg', async () => {
    var dinoBal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    var holdingBal = await provider.connection.getTokenAccountBalance(holdingAcct);
    dinoBal = parseInt(dinoBal.value.amount);
    holdingBal = parseInt(holdingBal.value.amount);
    var stakeBefore = await program.account.stakeAccount.fetch(stakeAcct);

    var amt = dinoToTestInAndOut;

    await program.rpc.getStakeDinoForEgg(
      new anchor.BN(amt), 
      { 
        accounts: {
          owner: provider.wallet.publicKey,
          aMint: mintDino.publicKey,
          bMint: mintEgg.publicKey,
          to: dinoTokenAcct,
          stake: stakeAcct,
          holding: holdingAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      }
    );

    var bal = await provider.connection.getTokenAccountBalance(dinoTokenAcct);
    assert.strictEqual(parseInt(bal.value.amount), dinoBal + amt);
    var bal = await provider.connection.getTokenAccountBalance(holdingAcct);
    assert.strictEqual(parseInt(bal.value.amount), holdingBal - amt);
    
    var s = await program.account.stakeAccount.fetch(stakeAcct);
    assert.strictEqual(s.aMintStaked.toNumber(), stakeBefore.aMintStaked.toNumber() - amt);
    assert.strictEqual(s.bMintEarned.toNumber(), 1); //earned in last 10 secs
  });

  delay(10000);

  //putting more stake
  it('put stake dino for egg 2', async () => {
    var amt = dinoToTestInAndOut;

    var stakeBefore = await program.account.stakeAccount.fetch(stakeAcct);

    const tx = await program.rpc.putStakeDinoForEgg(
      new anchor.BN(amt), 
      { 
        accounts: {
          owner: provider.wallet.publicKey,
          aMint: mintDino.publicKey,
          bMint: mintEgg.publicKey,
          from: dinoTokenAcct,
          stake: stakeAcct,
          holding: holdingAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      });

    var s = await program.account.stakeAccount.fetch(stakeAcct)
    assert.strictEqual(s.aMintStaked.toNumber(), stakeBefore.aMintStaked.toNumber() + amt);
    assert.strictEqual(s.bMintEarned.toNumber(), 2); //earned in last 10 secs
  });

  //claiming the egg reward
  it('claim egg', async () => {
    var amt = 2;

    var stakeBefore = await program.account.stakeAccount.fetch(stakeAcct);
    //confirm setup (prev test)
    assert.strictEqual(stakeBefore.bMintEarned.toNumber(), 2); 

    const tx = await program.rpc.claimEggFromDino(
      { 
        accounts: {
          owner: provider.wallet.publicKey,
          aMint: mintDino.publicKey,
          bMint: mintEgg.publicKey,
          to: eggTokenAcct,
          stake: stakeAcct,
          authority: eggAuthAcct,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        },
      });

    var s = await program.account.stakeAccount.fetch(stakeAcct)
    assert.strictEqual(s.bMintEarned.toNumber(), 0); 

    var bal = await provider.connection.getTokenAccountBalance(eggTokenAcct);
    assert.strictEqual(parseInt(bal.value.amount), amt);
  });
  
  it('migrate staking', async () => {

    let s;
    let s2;

    s = await program.account.stakeAccount.fetch(stakeAcct);
    try {
      s2 = await program.account.stakeAccountV2.fetch(stakeAcctV2);
      assert.fail("stake v2 should not exist");
    } catch { }

    await program.rpc.migrateStakingAccountV1V2({ 
      accounts: {
        owner: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        aMint: mintDino.publicKey,
        bMint: mintEgg.publicKey,
        stake: stakeAcct,
        stakeV2: stakeAcctV2,
        rent: RENT_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      },
    });

    try {
      s = await program.account.stakeAccount.fetch(stakeAcct);
      assert.fail("stake v1 should not exist");
    } catch { }
    s2 = await program.account.stakeAccountV2.fetch(stakeAcctV2);

    assert.equal(s.currentStakeUnixTimestamp.toString(), s2.currentStakeUnixTimestamp.toString());
    assert.equal(s.aMintStaked.toString(), s2.aMintStaked.toString());
    assert.equal(s.bMintEarned.toString(), s2.bMintEarned.toString());

  });
*/
});

function delay(interval) 
{
   return it('should delay', done => 
   {
      setTimeout(() => done(), interval)

   }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}