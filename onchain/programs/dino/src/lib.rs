//This program is used for a reward token that is MINTED as a result of staking.
//The program assumes authority of the mint so that tokens can only be minted through this program.
//currently uses a

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::create_account;
use anchor_spl::token::{
    self, InitializeAccount, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer,
};
use std::env;

const EGG_PUBKEY: &'static str = env!("EGG_PUBKEY");

//mint a
const DINO_PUBKEY: &'static str = env!("DINO_PUBKEY");
//mint v
const STEP_LP_PUBKEY: &'static str = env!("STEP_LP_PUBKEY");
//mint w
const RAYDIUM_LP_PUBKEY: &'static str = env!("RAYDIUM_LP_PUBKEY");

//for tracking what has been earned per X seconds - based on lowest possible value per mint # decimals
//100k dino is 1 egg in 2.5M sec (~30 days)
const RATE_DINO: u128 = 1;
const RATE_DIV_DINO: u128 = 2_500_000 * 100_000;
const RATE_STEP_LP: u128 = 2 * 288; //100 8 Step decimals -> 6 dino conversion * 2 LP Bonus Factor * 2,152,687 DINO in pool / 149.53 LP tokens
const RATE_DIV_STEP_LP: u128 = 2_500_000 * 100_000;
const RATE_RAYDIUM_LP: u128 = 5; //its 5x
const RATE_DIV_RAYDIUM_LP: u128 = 2_500_000 * 100_000; 
const RATE_X: u128 = 0;
const RATE_DIV_X: u128 = 2_500_000 * 100_000;
const RATE_Y: u128 = 0;
const RATE_DIV_Y: u128 = 2_500_000 * 100_000;
const RATE_Z: u128 = 0;
const RATE_DIV_Z: u128 = 2_500_000 * 100_000;

const DINO_EGG_X_SEC: u128 = 1;
const DINO_EGG_BEGIN: i64 = 1626912000;
const DINO_EGG_HALF: u64 = 66 * 24 * 60 * 60; //half the rewards every 66 days

//bonus if claimed within these hours
const BONUS_PERCENTAGE: u64 = 10;
const BONUS_HOURS_MAX: i64 = 38;

declare_id!("RAWRbJtj6gnQhC13v4VUPY3LxkwAiDXuH42uaR38ywf");

#[program]
pub mod dino {
    use super::*;

    //called ONCE per pair to initialize the authority on the B mint, and create a holding account
    pub fn init_holding_and_mint(ctx: Context<InitHoldingAndMint>) -> ProgramResult {
        //set the mint authority

        msg!("init: setting mint auth");

        let (found_minting_address, _found_minting_nonce) = Pubkey::find_program_address(
            &[b"minting", ctx.accounts.b_mint.key().as_ref()],
            &ctx.program_id,
        );

        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.payer.to_account_info(),
                account_or_mint: ctx.accounts.b_mint.to_account_info(),
            },
        )
        .with_remaining_accounts(ctx.accounts.to_account_infos());
        token::set_authority(
            cpi,
            spl_token::instruction::AuthorityType::MintTokens,
            Some(found_minting_address),
        )?;

        //create the holding account

        msg!("init: creating holding");

        let holding_nonce =
            check_holding_get_nonce(&ctx.accounts.holding.key(), &ctx.accounts.a_mint.key())
                .unwrap();

        let mint_key = ctx.accounts.a_mint.key();
        let holding_signer = &[b"holding", mint_key.as_ref(), &[holding_nonce]];
        let signers = &[&holding_signer[..]];

        //ancient way of doing things
        let create_instruction = create_account(
            &ctx.accounts.payer.key(),
            &ctx.accounts.holding.key(),
            ctx.accounts.rent.minimum_balance(165),
            165,
            &ctx.accounts.token_program.key(),
        );
        anchor_lang::solana_program::program::invoke_signed(
            &create_instruction,
            &ctx.accounts.to_account_infos(),
            signers,
        )?;

        //token is exposed through newer cpi model (had to fix in anchor repo)
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            InitializeAccount {
                account: ctx.accounts.holding.to_account_info(),
                mint: ctx.accounts.a_mint.to_account_info(),
                authority: ctx.accounts.holding.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        )
        .with_signer(signers);
        token::initialize_account(cpi)?;

        msg!("RAWR");

        Ok(())
    }

    //called ONCE FOR EACH to create the v2 holding accounts
    pub fn init_holding_v2(ctx: Context<InitHoldingAndMintV2>) -> ProgramResult {
        let mint_key_string = ctx.accounts.mint.key().to_string();

        if mint_key_string != *STEP_LP_PUBKEY && mint_key_string != *RAYDIUM_LP_PUBKEY {
            return Err(ErrorCode::MintV2Invalid.into());
        }

        //create the holding account
        msg!("init: creating holding for {}", ctx.accounts.mint.key());

        let holding_nonce =
            check_holding_get_nonce(&ctx.accounts.holding.key(), &ctx.accounts.mint.key()).unwrap();

        let mint_key = ctx.accounts.mint.key();
        let holding_signer = &[b"holding", mint_key.as_ref(), &[holding_nonce]];
        let signers = &[&holding_signer[..]];

        //ancient way of doing things
        let create_instruction = create_account(
            &ctx.accounts.payer.key(),
            &ctx.accounts.holding.key(),
            ctx.accounts.rent.minimum_balance(165),
            165,
            &ctx.accounts.token_program.key(),
        );
        anchor_lang::solana_program::program::invoke_signed(
            &create_instruction,
            &ctx.accounts.to_account_infos(),
            signers,
        )?;

        //token is exposed through newer cpi model (had to fix in anchor repo)
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            InitializeAccount {
                account: ctx.accounts.holding.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                authority: ctx.accounts.holding.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        )
        .with_signer(signers);
        token::initialize_account(cpi)?;

        msg!("RAWR");

        Ok(())
    }

    //user can use to migrate their staking account
    pub fn migrate_staking_account_v1_v2(ctx: Context<MigrateStakingV1V2>) -> ProgramResult {
        ctx.accounts.stake_v2.owner = ctx.accounts.stake.owner;
        ctx.accounts.stake_v2.dino_mint_staked = ctx.accounts.stake.a_mint_staked;
        ctx.accounts.stake_v2.b_mint_earned_from_dino = ctx.accounts.stake.b_mint_earned;
        ctx.accounts.stake_v2.current_stake_unix_timestamp =
            ctx.accounts.stake.current_stake_unix_timestamp;
        Ok(())
    }

    //user can use to init their staking account
    pub fn init_staking_accounts_v2(ctx: Context<InitStakingV2>) -> ProgramResult {
        ctx.accounts.stake_v2.owner = *ctx.accounts.owner.key;
        Ok(())
    }

    pub fn put_stake_dino_for_egg(ctx: Context<PutStake>, amount: u64) -> ProgramResult {
        put_stake(ctx, amount, DINO_EGG_BEGIN, DINO_EGG_HALF, DINO_EGG_X_SEC)?;

        msg!("RAWR");

        Ok(())
    }

    pub fn get_stake_dino_for_egg(ctx: Context<GetStake>, amount: u64) -> ProgramResult {
        get_stake(ctx, amount, DINO_EGG_BEGIN, DINO_EGG_HALF, DINO_EGG_X_SEC)?;

        msg!("RAWR");

        Ok(())
    }

    pub fn claim_egg_from_dino(ctx: Context<ClaimReward>) -> ProgramResult {
        claim(ctx, DINO_EGG_BEGIN, DINO_EGG_HALF, DINO_EGG_X_SEC)?;

        msg!("RAWR");

        Ok(())
    }
}

//generic methods for staking activities

fn put_stake(
    ctx: Context<PutStake>,
    amount: u64,
    begin: i64,
    half: u64,
    x_sec: u128,
) -> ProgramResult {
    msg!("put stake: begin");
    //validates holdings account
    let _holding_nonce =
        check_holding_get_nonce(&ctx.accounts.holding.key(), &ctx.accounts.holding.mint)?;

    apply_outstanding_earnings(
        &mut ctx.accounts.stake,
        &ctx.accounts.clock,
        begin,
        half,
        x_sec,
    )?;

    msg!(
        "put stake: transferring {} from {} to {}",
        amount,
        ctx.accounts.from.key(),
        ctx.accounts.holding.key()
    );
    let cpi = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.holding.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );
    token::transfer(cpi, amount)?;

    msg!("put stake: setting amount staked");
    {
        //the field to increment depends on the mint
        let stake_count: &mut u64 =
            get_mutable_field(&mut ctx.accounts.stake, &ctx.accounts.holding.mint).unwrap();
        *stake_count = stake_count.checked_add(amount).unwrap();
    }

    msg!(
        "put stake: stake time is {}",
        ctx.accounts.clock.unix_timestamp
    );
    ctx.accounts.stake.current_stake_unix_timestamp = ctx.accounts.clock.unix_timestamp;

    Ok(())
}

fn get_stake(
    ctx: Context<GetStake>,
    amount: u64,
    begin: i64,
    half: u64,
    x_sec: u128,
) -> ProgramResult {
    msg!("get stake: begin");

    apply_outstanding_earnings(
        &mut ctx.accounts.stake,
        &ctx.accounts.clock,
        begin,
        half,
        x_sec,
    )?;

    let holding_nonce =
        check_holding_get_nonce(&ctx.accounts.holding.key(), &ctx.accounts.holding.mint)?;
    let mint_key = &ctx.accounts.holding.mint;
    let holding_signer = &[b"holding", mint_key.as_ref(), &[holding_nonce]];
    let signers = &[&holding_signer[..]];
    msg!(
        "get stake: transferring {} from {} to {}",
        amount,
        ctx.accounts.to.key(),
        ctx.accounts.holding.key()
    );
    let cpi = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.holding.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.holding.to_account_info(),
        },
    )
    .with_signer(signers);
    token::transfer(cpi, amount)?;

    msg!("get stake: setting amount staked");
    {
        //the field to deccrement depends on the mint
        let stake_count: &mut u64 =
            get_mutable_field(&mut ctx.accounts.stake, &ctx.accounts.holding.mint).unwrap();
        if amount > *stake_count {
            return Err(ErrorCode::InsufficientStake.into());
        }
        *stake_count = stake_count.checked_sub(amount).unwrap();
    }

    msg!(
        "get stake: stake time is {}",
        ctx.accounts.clock.unix_timestamp
    );
    ctx.accounts.stake.current_stake_unix_timestamp = ctx.accounts.clock.unix_timestamp;

    //todo reclaim stake account if emptying stake

    Ok(())
}

fn claim<'info>(
    ctx: Context<ClaimReward<'info>>,
    begin: i64,
    half: u64,
    x_sec: u128,
) -> ProgramResult {
    msg!("claim: begin");

    apply_outstanding_earnings(
        &mut ctx.accounts.stake,
        &ctx.accounts.clock,
        begin,
        half,
        x_sec,
    )?;

    let stake = &ctx.accounts.stake;
    let earned = stake
        .b_mint_earned_from_dino
        .checked_add(stake.b_mint_earned_from_step_lp)
        .unwrap()
        .checked_add(stake.b_mint_earned_from_raydium_lp)
        .unwrap()
        .checked_add(stake.b_mint_earned_from_x)
        .unwrap()
        .checked_add(stake.b_mint_earned_from_y)
        .unwrap()
        .checked_add(stake.b_mint_earned_from_z)
        .unwrap();

    msg!("claim: earned {}", earned);
    if earned == 0 {
        return Err(ErrorCode::NoRewardForYou.into());
    }

    emit!(Claim { amount: earned });

    //get our mint auth signer
    let (found_minting_address, minting_nonce) = Pubkey::find_program_address(
        &[b"minting", ctx.accounts.b_mint.key().as_ref()],
        &ctx.program_id,
    );
    //validate auth (it'd fail anyway - but why not give a better err)
    if *ctx.accounts.authority.key != found_minting_address {
        return Err(ErrorCode::AuthorityInvalid.into());
    }
    let mint_key = ctx.accounts.b_mint.key();
    let minting_signer = &[b"minting", mint_key.as_ref(), &[minting_nonce]];

    let signers = &[&minting_signer[..]];
    msg!("claim: minting {} to {}", earned, ctx.accounts.to.key());
    let cpi = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.b_mint.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    )
    //signed by the pda mint authority
    .with_signer(signers);
    token::mint_to(cpi, earned)?;

    msg!("claim: resetting amount earned");
    ctx.accounts.stake.b_mint_earned_from_dino = 0;
    ctx.accounts.stake.b_mint_earned_from_step_lp = 0;
    ctx.accounts.stake.b_mint_earned_from_raydium_lp = 0;
    ctx.accounts.stake.b_mint_earned_from_x = 0;
    ctx.accounts.stake.b_mint_earned_from_y = 0;
    ctx.accounts.stake.b_mint_earned_from_z = 0;

    msg!(
        "claim: new stake time is {}",
        ctx.accounts.clock.unix_timestamp
    );
    ctx.accounts.stake.current_stake_unix_timestamp = ctx.accounts.clock.unix_timestamp;

    Ok(())
}

//helper methods

fn check_holding_get_nonce<'info>(expected_holdings: &Pubkey, mint: &Pubkey) -> Result<u8> {
    let (found_holdings_address, found_holdings_nonce) =
        Pubkey::find_program_address(&[b"holding", mint.as_ref()], &id());
    if found_holdings_address != *expected_holdings {
        msg!(
            "check: holding invalid - got {} expected {}",
            found_holdings_address,
            expected_holdings.key()
        );
        return Err(ErrorCode::HoldingInvalid.into());
    }
    Ok(found_holdings_nonce)
}

fn get_mutable_field<'a, 'info>(
    stake: &'a mut Account<'info, StakeAccountV2>,
    mint: &Pubkey,
) -> Result<&'a mut u64> {
    let mint_string = mint.to_string();
    match mint_string.as_ref() {
        DINO_PUBKEY => Ok(&mut stake.dino_mint_staked),
        STEP_LP_PUBKEY => Ok(&mut stake.step_lp_mint_staked),
        RAYDIUM_LP_PUBKEY => Ok(&mut stake.raydium_lp_mint_staked),
        _ => Err(ErrorCode::MintV2Invalid.into()),
    }
}

fn apply_outstanding_earnings<'info>(
    stake_acct: &mut Account<'info, StakeAccountV2>,
    clock_acct: &Sysvar<'info, Clock>,
    begin: i64,
    half: u64,
    x_sec: u128,
) -> Result<()> {
    if stake_acct.dino_mint_staked > 0
        || stake_acct.step_lp_mint_staked > 0
        || stake_acct.raydium_lp_mint_staked > 0
    {
        msg!("apply: existing amount present");
        //we have to compute and record what has been earned so that
        //calculations on the new amount begin
        let orig_start = stake_acct.current_stake_unix_timestamp;
        let orig_end = clock_acct.unix_timestamp;

        let earned_from_dino = compute_earnings(
            stake_acct.dino_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_DINO,
            RATE_DIV_DINO,
            x_sec,
        )?;
        msg!("earned_from_dino {}", earned_from_dino);

        let earned_from_step_lp = compute_earnings(
            stake_acct.step_lp_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_STEP_LP,
            RATE_DIV_STEP_LP,
            x_sec,
        )?;
        msg!("dino earned_from_step_lp earnings {}", earned_from_step_lp);

        let earned_from_raydium_lp = compute_earnings(
            stake_acct.raydium_lp_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_RAYDIUM_LP,
            RATE_DIV_RAYDIUM_LP,
            x_sec,
        )?;
        msg!(
            "dino earned_from_raydium_lp earnings {}",
            earned_from_raydium_lp
        );

        let earned_from_x = compute_earnings(
            stake_acct.x_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_X,
            RATE_DIV_X,
            x_sec,
        )?;
        msg!("dino earned_from_x earnings {}", earned_from_x);

        let earned_from_y = compute_earnings(
            stake_acct.y_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_Y,
            RATE_DIV_Y,
            x_sec,
        )?;
        msg!("dino earned_from_y earnings {}", earned_from_y);

        let earned_from_z = compute_earnings(
            stake_acct.z_mint_staked,
            orig_start,
            orig_end,
            begin,
            half,
            RATE_Z,
            RATE_DIV_Z,
            x_sec,
        )?;
        msg!("dino earned_from_z earnings {}", earned_from_z);

        let mut earned = earned_from_dino
            .checked_add(earned_from_step_lp)
            .unwrap()
            .checked_add(earned_from_raydium_lp)
            .unwrap()
            .checked_add(earned_from_x)
            .unwrap()
            .checked_add(earned_from_y)
            .unwrap()
            .checked_add(earned_from_z)
            .unwrap();

        //earn extra 10% if within 24hrs of last update
        let mut bonus: u64 = 0;
        let last_update = stake_acct.current_stake_unix_timestamp;
        let bonus_hrs_ago = clock_acct
            .unix_timestamp
            .checked_sub(BONUS_HOURS_MAX * 60 * 60)
            .unwrap();
        msg!(
            "last claim was {}; {} hrs ago is {}",
            last_update,
            BONUS_HOURS_MAX,
            bonus_hrs_ago
        );
        if last_update > bonus_hrs_ago {
            bonus = earned.checked_div(BONUS_PERCENTAGE).unwrap();
            if bonus > 0 {
                msg!(
                    "bonus claim: earned bonus of {} on top of {}",
                    bonus,
                    earned
                );
                earned = earned.checked_add(bonus).unwrap();
            }
        }

        emit!(Earned {
            total_amount: earned,
            bonus_amount: bonus
        });

        stake_acct.b_mint_earned_from_dino = stake_acct
            .b_mint_earned_from_dino
            .checked_add(earned_from_dino)
            .unwrap();
        stake_acct.b_mint_earned_from_step_lp = stake_acct
            .b_mint_earned_from_step_lp
            .checked_add(earned_from_step_lp)
            .unwrap();
        stake_acct.b_mint_earned_from_raydium_lp = stake_acct
            .b_mint_earned_from_raydium_lp
            .checked_add(earned_from_raydium_lp)
            .unwrap();
        stake_acct.b_mint_earned_from_x = stake_acct
            .b_mint_earned_from_x
            .checked_add(earned_from_x)
            .unwrap();
        stake_acct.b_mint_earned_from_y = stake_acct
            .b_mint_earned_from_y
            .checked_add(earned_from_y)
            .unwrap();

        //hijacking z for bonus
        stake_acct.b_mint_earned_from_z =
            stake_acct.b_mint_earned_from_z.checked_add(bonus).unwrap();

        msg!("apply: credited for {} earned", earned);
        return Ok(());
    }

    Ok(())
}

fn compute_earnings(
    amount: u64,
    start: i64,
    end: i64,
    begin: i64,
    half: u64,
    rate: u128,
    rate_divisor: u128,
    x_sec: u128,
) -> Result<u64> {
    let mut rel_start: i64 = start;
    let mut rel_end: i64 = end;

    if rel_end < rel_start {
        return Err(ErrorCode::ElapsedInvalid.into());
    }
    if rel_end <= begin {
        msg!("compute earnings: rewards have not started");
        //rewards have not started
        return Ok(0);
    }
    if rel_start < begin {
        rel_start = begin;
    }
    //current start, end, begin are all absolute epoch time
    //convert to relative to begin
    rel_start = rel_start.checked_sub(begin).unwrap();
    rel_end = rel_end.checked_sub(begin).unwrap();

    //extra range checks, should not be needed
    if rel_start < 0 {
        return Err(ErrorCode::ElapsedInvalid.into());
    }
    if rel_end < 1 {
        return Err(ErrorCode::ElapsedInvalid.into());
    }
    if rel_end < rel_start {
        return Err(ErrorCode::ElapsedInvalid.into());
    }

    msg!("compute earnings: rel_start {}", rel_start);
    msg!("compute earnings: rel_end {}", rel_end);

    //we used to do a thirdening every X days, but we cancelled them after 1.  so the logic below is nutty.

    //tuple (epoch, offset)
    let start_halving = ((rel_start as u64 / half) as u32, rel_start as u64 % half);
    let end_halving = ((rel_end as u64 / half) as u32, rel_end as u64 % half);

    //start and end in same halving - just compute the single one
    if start_halving.0 == end_halving.0 {
        msg!("same epoch: {}", start_halving.0);
        return get_amount(
            start_halving.1 as u64,
            end_halving.1 as u64,
            x_sec,
            rate,
            amount,
            rate_divisor
                .checked_mul((3 as u128).pow(if start_halving.0 > 1 {
                    1
                } else {
                    start_halving.0
                }))
                .unwrap(),
        );
    }

    let mut total = 0 as u64;
    //first
    total += get_amount(
        start_halving.1 as u64,
        half as u64,
        x_sec,
        rate,
        amount,
        rate_divisor
            .checked_mul((3 as u128).pow(if start_halving.0 > 1 {
                1
            } else {
                start_halving.0
            }))
            .unwrap(),
    )
    .unwrap();
    msg!("first: {} from {:?} to {}", total, start_halving, half);
    //middle
    if end_halving.0 - start_halving.0 > 1 {
        total += ((start_halving.0 + 1)..end_halving.0).fold(0, |sum, val| {
            sum + get_amount(
                0,
                half,
                x_sec,
                rate,
                amount,
                rate_divisor
                    .checked_mul((3 as u128).pow(if val > 1 { 1 } else { val }))
                    .unwrap(),
            )
            .unwrap()
        });
        msg!("middle: {}", total);
    }
    //last
    total += get_amount(
        0,
        end_halving.1 as u64,
        x_sec,
        rate,
        amount,
        rate_divisor
            .checked_mul((3 as u128).pow(if end_halving.0 > 1 { 1 } else { end_halving.0 }))
            .unwrap(),
    )
    .unwrap();
    msg!("last: {} from 0 to {:?}", total, end_halving);
    Ok(total)
}

fn get_amount(a: u64, b: u64, x_sec: u128, rate: u128, amount: u64, div: u128) -> Result<u64> {
    let elapsed_periods = (b.checked_sub(a).unwrap() as u128)
        .checked_div(x_sec)
        .unwrap();
    msg!(
        "compute earnings: elapsed periods {} at {} div {}",
        elapsed_periods,
        rate,
        div
    );
    let amt = elapsed_periods
        .checked_mul(rate)
        .unwrap()
        .checked_mul(amount as u128)
        .unwrap()
        .checked_div(div)
        .unwrap();

    Ok(amt as u64)
}

//anchor format accounts

#[derive(Accounts)]
pub struct InitHoldingAndMint<'info> {
    payer: Signer<'info>,

    #[account(
        constraint = a_mint.key().to_string() == DINO_PUBKEY,
    )]
    a_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    /// CHECK: can't remember
    holding: UncheckedAccount<'info>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitHoldingAndMintV2<'info> {
    payer: Signer<'info>,

    mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    /// CHECK: can't remember
    holding: UncheckedAccount<'info>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MigrateStakingV1V2<'info> {
    /// CHECK: can't remember
    owner: UncheckedAccount<'info>,

    #[account(mut)]
    payer: Signer<'info>,

    a_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        close = payer,
        seeds = [
            b"anchor".as_ref(),
            owner.key().as_ref(), 
            a_mint.key().as_ref(),
            b_mint.key().as_ref()
        ],
        bump,
    )]
    stake: Account<'info, StakeAccount>,

    #[account(
        init,
        space = 8 + StakeAccountV2::SPACE, 
        seeds = [
            owner.key().as_ref(), 
            b_mint.key().as_ref(),
            a_mint.key().as_ref()
        ],
        bump,
        payer = payer,
    )]
    stake_v2: Box<Account<'info, StakeAccountV2>>,

    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitStakingV2<'info> {
    #[account(mut)]
    owner: Signer<'info>,

    #[account(
        constraint = a_mint.key().to_string() == DINO_PUBKEY,
    )]
    a_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(
        init, 
        space = 8 + StakeAccountV2::SPACE, 
        payer = owner,
        seeds = [
            owner.key().as_ref(), 
            b_mint.key().as_ref(),
            a_mint.key().as_ref()
        ],
        bump,
    )]
    stake_v2: Box<Account<'info, StakeAccountV2>>,

    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct PutStake<'info> {
    owner: Signer<'info>,

    a_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    from: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        has_one = owner, 
        seeds = [
            owner.key().as_ref(), 
            b_mint.key().as_ref(),
            a_mint.key().as_ref()
        ],
        bump,
    )]
    stake: Account<'info, StakeAccountV2>,

    #[account(mut)]
    holding: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct GetStake<'info> {
    owner: Signer<'info>,

    a_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(
        mut, 
        has_one = owner, 
    )]
    to: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        has_one = owner, 
        seeds = [
            owner.key().as_ref(),
            b_mint.key().as_ref(),
            a_mint.key().as_ref()
        ],
        bump,
    )]
    stake: Account<'info, StakeAccountV2>,

    #[account(
        mut,
        constraint = holding.amount >= amount, 
    )]
    holding: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    owner: Signer<'info>,

    a_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = b_mint.key().to_string() == EGG_PUBKEY,
    )]
    b_mint: Box<Account<'info, Mint>>,

    #[account(
        mut, 
        has_one = owner, 
        constraint = to.mint == b_mint.key(),
    )]
    to: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        has_one = owner, 
        seeds = [
            owner.key().as_ref(),
            b_mint.key().as_ref(),
            a_mint.key().as_ref()
        ],
        bump,
    )]
    stake: Account<'info, StakeAccountV2>,

    /// CHECK: can't remember
    authority: UncheckedAccount<'info>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
    system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct StakeAccount {
    owner: Pubkey,
    a_mint_staked: u64,
    b_mint_earned: u64,
    current_stake_unix_timestamp: i64,
}

#[account]
#[derive(Default)]
pub struct StakeAccountV2 {
    owner: Pubkey,
    dino_mint_staked: u64,
    step_lp_mint_staked: u64,
    raydium_lp_mint_staked: u64,
    x_mint_staked: u64,
    y_mint_staked: u64,
    z_mint_staked: u64,
    b_mint_earned_from_dino: u64,
    b_mint_earned_from_step_lp: u64,
    b_mint_earned_from_raydium_lp: u64,
    b_mint_earned_from_x: u64,
    b_mint_earned_from_y: u64,
    b_mint_earned_from_z: u64,
    current_stake_unix_timestamp: i64,
}

impl StakeAccountV2 {
    const SPACE:usize = 32+(8*13);
}

#[event]
pub struct Earned {
    pub total_amount: u64,
    pub bonus_amount: u64,
}

#[event]
pub struct Claim {
    pub amount: u64,
}

#[error]
pub enum ErrorCode {
    #[msg("An invalid amount of time has elapsed")]
    ElapsedInvalid,
    #[msg("Invalid holding account")]
    HoldingInvalid,
    #[msg("Invalid authority")]
    AuthorityInvalid,
    #[msg("No reward available")]
    NoRewardForYou,
    #[msg("Mint A invalid")]
    MintAInvalid,
    #[msg("Mint B invalid")]
    MintBInvalid,
    #[msg("Mint for v2 invalid")]
    MintV2Invalid,
    #[msg("Insufficient stake")]
    InsufficientStake,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_not_begun_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN - 100,
            DINO_EGG_BEGIN - 1,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 0);
    }

    #[test]
    fn test_100k_10s_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN,
            DINO_EGG_BEGIN + 10,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 4);
    }

    #[test]
    fn test_100k_10s_prestake_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN - 100,
            DINO_EGG_BEGIN + 10,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 4);
    }

    #[test]
    fn test_100k_1mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN,
            DINO_EGG_BEGIN + 2_678_401,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 1_071_360);
    }

    #[test]
    //
    fn test_100k_after_half_1mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN + DINO_EGG_HALF as i64 + 100,
            DINO_EGG_BEGIN + DINO_EGG_HALF as i64 + 100 + 2_678_401,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 357_120);
    }

    #[test]
    fn test_100k_6mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN,
            DINO_EGG_BEGIN + 16_070_406,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 3_248_640);
    }

    #[test]
    fn test_100k_2nd_1mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN + 2_678_400,
            DINO_EGG_BEGIN + 5_356_800,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 1_071_360);
    }

    #[test]
    fn test_100k_3rd_1mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN + 5_356_800,
            DINO_EGG_BEGIN + 8_035_200,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 449_280);
    }

    #[test]
    fn test_100k_3rd_6mo_compute_earnings() {
        let amt = compute_earnings(
            100_000_000_000,
            DINO_EGG_BEGIN + 5_356_800,
            DINO_EGG_BEGIN + 5_356_800 + 16_070_406,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 1_216_000);
    }

    #[test]
    fn test_150m_1mo_compute_earnings() {
        let amt = compute_earnings(
            150_000_000_000_000,
            DINO_EGG_BEGIN,
            DINO_EGG_BEGIN + 2_678_401,
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 1_607_040_600);
    }

    #[test]
    fn test_150m_120mo_compute_earnings() {
        let amt = compute_earnings(
            150_000_000_000_000,
            DINO_EGG_BEGIN,
            DINO_EGG_BEGIN + (2_678_401 * 120),
            DINO_EGG_BEGIN,
            DINO_EGG_HALF,
            RATE_DINO,
            RATE_DIV_DINO,
            DINO_EGG_X_SEC,
        )
        .unwrap();
        assert_eq!(amt, 5_132_159_993);
    }
}
