use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Incubator {
    pub owner: Pubkey,
    pub slot: u64,
    pub winning_hash: [u8; 32],
    pub amount_burned: u64,
}

impl Incubator {
    pub const SPACE: usize = 32 + 8 + 32 + 8;
}