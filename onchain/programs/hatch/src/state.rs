use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Hatcher {
    pub owner: Pubkey,
    pub slot: u64,
    pub winning_hash: [u8; 32],
    pub rarity_burned: u8,
}

impl Hatcher {
    pub const SPACE: usize = 32 + 8 + 32 + 1;
}

#[account(zero_copy)]
pub struct ClaimMask {
    pub mask: [u8; 1252], // ceil(bucket_sizes)
}

impl ClaimMask {
    pub const SPACE: usize = 1252;
}

impl Default for ClaimMask {
    fn default() -> Self {
        Self { mask: [0; 1252] }
    }
}
