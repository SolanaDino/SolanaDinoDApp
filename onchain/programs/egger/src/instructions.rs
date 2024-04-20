use crate::FEE_PUBKEY;
use crate::EGG_PUBKEY;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_lang::solana_program::sysvar::slot_hashes;
use crate::state::Incubator;

#[derive(Accounts)]
pub struct BeginCreate<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        space = 8 + Incubator::SPACE,
        seeds = [ owner.key.as_ref() ],
        bump,
        payer = owner,
    )]
    pub incubator: Box<Account<'info, Incubator>>,

    #[account(
        mut,
        has_one = owner,
    )]
    pub egg_acct: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = EGG_PUBKEY.len() == 0 || EGG_PUBKEY == egg_mint.key().to_string()
    )]
    pub egg_mint: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(incubator_nonce: u8)]
pub struct ClaimEggNft<'info> {
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner,
        seeds = [ owner.key.as_ref() ],
        bump = incubator_nonce,
        close = fee_account,
    )]
    pub incubator: Account<'info, Incubator>,

    #[account(
        address = slot_hashes::id(),
    )]
    /// CHECK: no clue
    pub slot_hashes: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = FEE_PUBKEY.len() == 0 || FEE_PUBKEY == fee_account.key().to_string()
    )]
    /// CHECK: no clue
    pub fee_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub egg_nft_mint: Account<'info, Mint>,

    #[account(mut)]
    pub egg_nft_token_account: Account<'info, TokenAccount>,

    /// CHECK: no clue
    pub egg_nft_auth: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}