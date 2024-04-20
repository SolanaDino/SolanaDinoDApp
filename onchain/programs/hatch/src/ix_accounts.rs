use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use super::FEE_PUBKEY;

use super::EGG_NFT_MINTS;
use super::state::*;

#[derive(Accounts)]
pub struct InitClaimMask<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + ClaimMask::SPACE,
        payer = payer,
        seeds = [ b"claim_mask".as_ref() ],
        bump,
    )]
    pub claim_mask: AccountLoader<'info, ClaimMask>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DestroyClaimMask<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        close = payer,
        seeds = [ b"claim_mask".as_ref() ],
        bump,
    )]
    pub claim_mask: AccountLoader<'info, ClaimMask>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BeginHatch<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account( 
        init,
        space = 8 + Hatcher::SPACE,
        seeds = [ owner.key.as_ref() ],
        bump,
        payer = owner,
    )]
    pub hatcher: Box<Account<'info, Hatcher>>,

    #[account(
        mut,
        has_one = owner,
    )]
    pub egg_nft_acct: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = EGG_NFT_MINTS.into_iter().any(|v| v == egg_nft_mint.key().to_string())
    )]
    pub egg_nft_mint: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AssignWinningHash<'info> {
    #[account(
        mut,
    )]
    pub hatcher: Box<Account<'info, Hatcher>>,

    #[account(
        address = "SysvarS1otHashes111111111111111111111111111".try_into().unwrap(),
    )]
    /// CHECK: hard coded id SysvarS1otHashes111111111111111111111111111
    pub slot_hashes: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ClaimDinoNft<'info> {
    #[account(
        mut,
    )]
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner,
        seeds = [ owner.key.as_ref() ],
        bump,
        close = fee_account,
        constraint = hatcher.winning_hash != [0u8; 32],
    )]
    pub hatcher: Account<'info, Hatcher>,

    #[account(
        mut,
        address = FEE_PUBKEY.try_into().unwrap(),
    )]
    pub fee_account: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [ b"claim_mask".as_ref() ],
        bump,
    )]
    pub claim_mask: AccountLoader<'info, ClaimMask>,

    #[account(
        seeds = [ b"authority".as_ref() ],
        bump,
    )]
    /// CHECK: The mint authority PDA; never read
    pub mint_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = owner,
        mint::authority = mint_authority,
        mint::decimals = 0,
    )]
    pub dino_mint: Account<'info, Mint>,

    /// CHECK: checked via the Metadata CPI call
    #[account(mut)]
    pub dino_metadata_account: UncheckedAccount<'info>,

    #[account(
        init,
        payer = owner,
        associated_token::mint = dino_mint,
        associated_token::authority = owner,
    )]
    pub dino_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        address = "DS1HUpxYUgySgNf1L6qzKNyU8akoKDahxhuiGkV4y7Vs".try_into().unwrap(),
    )]
    /// CHECK: checked via the Metadata CPI call, and hardcoded address
    pub collection_mint: UncheckedAccount<'info>,

    #[account(
        mut,
        address = "B6czFPKghvbntrYmHXiFWAyXh9fXHwEazZPXoshMJCiF".try_into().unwrap(),
    )]
    /// CHECK: checked via the Metadata CPI call, and hardcoded address
    pub collection_metadata: UncheckedAccount<'info>,

    #[account(
        address = "6ANFNf5pG9FRsXX6Br69LxzDRDS5RfyGT2RK7qPG53RW".try_into().unwrap(),
    )]
    /// CHECK: checked via the Metadata CPI call, and hardcoded address
    pub collection_master_edition: UncheckedAccount<'info>,

    #[account(
        address = "5gaJrn9zV8moJfUHMJzsCCwEo8HvoquTfQzZWKRD6n9j".try_into().unwrap(),
    )]
    /// CHECK: checked via the Metadata CPI call, and hardcoded address
    pub collection_authority_record: UncheckedAccount<'info>,

    /// CHECK: checked via account constraints
    #[account(
        address = mpl_token_metadata::ID
    )]
    pub metadata_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct GetWinningIndex<'info> {
    #[account(
        constraint = hatcher.winning_hash != [0u8; 32],
    )]
    pub hatcher: Account<'info, Hatcher>,

    #[account(
        seeds = [ b"claim_mask".as_ref() ],
        bump,
    )]
    pub claim_mask: AccountLoader<'info, ClaimMask>,
}