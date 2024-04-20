use anchor_lang::prelude::*;

#[error_code]
pub enum HatcherErrorCode {
    #[msg("Dino has not begun developing")]
    NoEligibleSlots,
    #[msg("Dino creation still in progress")]
    NoConsecutiveSlots,
    #[msg("An attempt was made to mint an nft type that was not correct")]
    AttemptToMintWrongDino,
    #[msg("Winning hash not assigned")]
    NeedAssignWinningHash,
    #[msg("Proof failed")]
    ProofFailure,
}
