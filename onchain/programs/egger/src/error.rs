use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
    #[msg("Egg has not begun developing")]
    NoEligibleSlots,
    #[msg("Egg creation still in progress")]
    NoConsecutiveSlots,
    #[msg("An attempt was made to mint an egg nft type that was not correct")]
    AttemptToMintWrongEgg,
    #[msg("Too much egg for equipment")]
    EggOverpayment,
    #[msg("Equipment requires more egg")]
    EggUnderpayment,
}