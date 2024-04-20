mod error;
mod instructions;
mod state;
mod sysvar_reader;

use std::convert::TryInto;
use std::default::Default;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::Hash;
use anchor_spl::token::{self, Burn, MintTo};

use error::*;
use instructions::*;
use sysvar_reader::*;

pub const EGG_PUBKEY: &'static str = env!("EGG_PUBKEY");
pub const FEE_PUBKEY: &'static str = env!("FEE_PUBKEY");

pub const EGG_NFT_MINT_1: &'static str = env!("EGG_NFT_MINT_1");
pub const EGG_NFT_MINT_2: &'static str = env!("EGG_NFT_MINT_2");
pub const EGG_NFT_MINT_3: &'static str = env!("EGG_NFT_MINT_3");
pub const EGG_NFT_MINT_4: &'static str = env!("EGG_NFT_MINT_4");

pub const MIN_EGG: u64 = 1000000;
pub const MAX_EGG: u64 = 4000000;

pub const SLOT_WAIT: u64 = 6;

declare_id!("eggLYZtrPdTdkwPFWcQL8qq7QM4AvXKtYBH2KK7gmxC");

#[program]
pub mod egger {
    use super::*;

    pub fn begin_create(
        ctx: Context<BeginCreate>,
        _incubator_nonce: u8,
        amount: u64,
    ) -> ProgramResult {
        if amount > MAX_EGG {
            return Err(ErrorCode::EggOverpayment.into());
        }
        if amount < MIN_EGG {
            return Err(ErrorCode::EggUnderpayment.into());
        }

        //burn egg
        msg!("frying {} egg", amount);
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.egg_mint.to_account_info(),
                to: ctx.accounts.egg_acct.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::burn(cpi, amount)?;

        //write account
        let incubator = &mut ctx.accounts.incubator;
        incubator.owner = ctx.accounts.owner.key();
        incubator.slot = Clock::get().unwrap().slot;
        incubator.amount_burned = amount;

        Ok(())
    }

    //todo, a intermediary determine winner step

    // claim nft
    pub fn claim_egg_nft(
        ctx: Context<ClaimEggNft>,
        _incubator_nonce: u8,
        auth_nonce: u8,
    ) -> ProgramResult {
        let incubator = &ctx.accounts.incubator;

        let s_data = ctx.accounts.slot_hashes.try_borrow_data()?;

        //a "winning" slot that we use for randomness is the
        //first (chronologically) slot whose prior slot wasn't skipped
        let mut winner: Option<(u64, &[u8])> = None;

        let check_win = Hash::new(&incubator.winning_hash);
        let mut found = false;
        let mut counter = 0;
        if check_win != Default::default() {
            //winner was already computed
            winner = Some((0, &incubator.winning_hash));
            found = true;
            msg!("winning hash already calculated")
        } else {
            //stores every slothash as we loop
            let mut winner_maybe: (u64, &[u8]) = Default::default();
            //the slot the result must be after
            let winning_slot = incubator.slot.checked_add(SLOT_WAIT).unwrap();

            let iter = get_slot_iter(&s_data);

            for sh in iter {
                //if this hash is immediately before the last
                //then the last was a possible winner
                if sh.0.checked_add(1).unwrap() == winner_maybe.0 {
                    winner = Some(winner_maybe);
                }
                if sh.0 <= winning_slot {
                    found = true;
                    break;
                }
                //swap in the actual blockhash
                winner_maybe = sh;
                //increment our depth counter
                counter = counter + 1;
            }

            msg!("iterated {} slots", counter);

            //if found slot, and no winner
            //fail out so user tries again - this means either too early
            //or no consecutive slot yet
            if found && winner.is_none() {
                msg!("searched {} slots but no winner", counter);
                return Err(ErrorCode::NoEligibleSlots.into());
            }
            //else, either we found a winner or we are too late
        }

        let resulting_egg: &str;
        if !found {
            msg!("Egg equipment entropy failure (expired incubator); searched {} slots", counter);
            if incubator.amount_burned < 4000000 {
                msg!("Blue Egg");
                resulting_egg = EGG_NFT_MINT_1;
            } else {
                msg!("Green Egg");
                resulting_egg = EGG_NFT_MINT_2;
            }
        } else {
            msg!(
                "slot {} hash is {}; searched {} slots",
                winner.unwrap().0,
                Hash::new(winner.unwrap().1), 
                counter,
            );

            //seed push up to u128 and * 10^egg decimals
            let seed = (u64::from_le_bytes(winner.unwrap().1[12..20].try_into().unwrap()) as u128)
                .checked_mul(1000000)
                .unwrap();

            //the top stop for our odds with the multiplier
            let seed_space = (u64::MAX as u128)
                .checked_mul(incubator.amount_burned.into())
                .unwrap();

            msg!("seed is {} seed space is {}", seed, seed_space);

            if seed < seed_space.checked_div(10000).unwrap() {
                msg!("Nuclear Egg");
                resulting_egg = EGG_NFT_MINT_4;
            } else if seed < seed_space.checked_div(50).unwrap() {
                msg!("Purple Egg");
                resulting_egg = EGG_NFT_MINT_3;
            } else if seed < seed_space.checked_div(4).unwrap() {
                msg!("Green Egg");
                resulting_egg = EGG_NFT_MINT_2;
            } else {
                msg!("Blue Egg");
                resulting_egg = EGG_NFT_MINT_1;
            }
        }

        //validate the resulting egg matches what was requested
        if resulting_egg.len() != 0 && resulting_egg != ctx.accounts.egg_nft_mint.key().to_string()
        {
            return Err(ErrorCode::AttemptToMintWrongEgg.into());
        }

        //mint
        let nonce_seed: &[u8] = &[auth_nonce];
        let signer = &[b"mint", nonce_seed];
        let signers = &[&signer[..]];
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.egg_nft_mint.to_account_info(),
                to: ctx.accounts.egg_nft_token_account.to_account_info(),
                authority: ctx.accounts.egg_nft_auth.to_account_info(),
            },
        )
        .with_signer(signers);
        token::mint_to(cpi, 1)?;

        Ok(())
    }
}
