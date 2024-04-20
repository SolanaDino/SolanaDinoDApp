mod error;
mod ix_accounts;
mod merkle_proof;
mod state;
mod sysvar_reader;

use anchor_lang::prelude::*;
use bit::BitIndex;

use error::*;
use ix_accounts::*;
use sysvar_reader::*;

use anchor_lang::solana_program::{hash::Hash, program::invoke_signed};
use anchor_spl::token::{
    self, mint_to, set_authority, spl_token::instruction::AuthorityType, Burn, MintTo, SetAuthority,
};
use mpl_token_metadata::{instruction::create_metadata_accounts_v3, state::Creator};

use crate::merkle_proof::verify;

use std::str::FromStr;

use anchor_lang::solana_program::program::invoke;
use mpl_token_metadata::instruction::{
    update_primary_sale_happened_via_token, verify_sized_collection_item,
};
use mpl_token_metadata::state::Collection;

pub const FEE_PUBKEY: &'static str = env!("FEE_PUBKEY");

pub const EGG_NFT_MINT_1: &'static str = env!("EGG_NFT_MINT_1");
pub const EGG_NFT_MINT_2: &'static str = env!("EGG_NFT_MINT_2");
pub const EGG_NFT_MINT_3: &'static str = env!("EGG_NFT_MINT_3");
pub const EGG_NFT_MINT_4: &'static str = env!("EGG_NFT_MINT_4");

pub const MERKLE_ROOT: [u8; 16] = [
    0b11011011, 0b00011011, 0b00110100, 0b01101111, 
    0b01000011, 0b01000101, 0b10001101, 0b10111100, 
    0b11001001, 0b11011011, 0b00111101, 0b10110010, 
    0b01110100, 0b01100011, 0b01011100, 0b00000110
];

pub const EGG_NFT_MINTS: [&str; 4] = [
    EGG_NFT_MINT_1,
    EGG_NFT_MINT_2,
    EGG_NFT_MINT_3,
    EGG_NFT_MINT_4,
];

pub const SLOT_WAIT: u64 = 6;

//byte offset, byte len, valid bits in last
pub const OFFSETS: [(usize, usize, usize); 4] =
    [(0, 763, 5), (763, 438, 4), (1201, 50, 6), (1251, 1, 2)];

declare_id!("HAtcHcNADtwriNaXzkLqMjANDxKSV9Zy5MK2m9kiYzCS");

#[program]
pub mod hatch {

    use super::*;

    pub fn init_claim_mask(_ctx: Context<InitClaimMask>) -> Result<()> {
        Ok(())
    }

    pub fn destroy_claim_mask(_ctx: Context<DestroyClaimMask>) -> Result<()> {
        Ok(())
    }

    pub fn begin_hatch(ctx: Context<BeginHatch>) -> Result<()> {
        //burn egg
        msg!("frying egg nft");
        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.egg_nft_mint.to_account_info(),
                from: ctx.accounts.egg_nft_acct.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::burn(cpi, 1)?;

        //write account
        let hatcher = &mut ctx.accounts.hatcher;
        hatcher.owner = ctx.accounts.owner.key();
        hatcher.slot = Clock::get().unwrap().slot;

        let s = ctx.accounts.egg_nft_mint.key().to_string();
        hatcher.rarity_burned = EGG_NFT_MINTS
            .iter()
            .position(|v| *v == s)
            .unwrap()
            .try_into()
            .unwrap();

        hatcher.winning_hash = [0u8; 32];

        msg!("rarity burned {}", hatcher.rarity_burned);

        Ok(())
    }

    pub fn assign_winning_hash(ctx: Context<AssignWinningHash>) -> Result<()> {
        let hatcher = &ctx.accounts.hatcher;

        let sai = ctx.accounts.slot_hashes.to_account_info();
        let s_data = sai.try_borrow_data()?;

        //a "winning" slot that we use for randomness is the
        //first (chronologically) slot whose prior slot wasn't skipped
        let mut winner: Option<(u64, &[u8])> = None;

        if hatcher.winning_hash != [0u8; 32] {
            msg!("winning hash already calculated")
        } else {
            let mut found = false;
            //stores every slothash as we loop
            let mut winner_maybe: (u64, &[u8]) = Default::default();
            //the slot the result must be after
            let winning_slot = hatcher.slot.checked_add(SLOT_WAIT).unwrap();

            let iter = get_slot_iter(&s_data);

            let mut counter = 0;
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
                return Err(HatcherErrorCode::NoEligibleSlots.into());
            }

            //else, either we found a winner or we are too late
            if found {
                msg!(
                    "winner slot {} hash is {}",
                    winner.unwrap().0,
                    Hash::new(winner.unwrap().1)
                );
                ctx.accounts
                    .hatcher
                    .winning_hash
                    .copy_from_slice(winner.unwrap().1);
            } else {
                msg!("too late, need to just accept the loss and claim lowest dino");
                ctx.accounts.hatcher.winning_hash = [0u8; 32];
                ctx.accounts.hatcher.winning_hash[31] = 1;
            }
        }

        Ok(())
    }

    pub fn claim_dino(
        ctx: Context<ClaimDinoNft>,
        uri: String,
        name: String,
        proof: Vec<[u8; 16]>,
    ) -> Result<()> {
        //find the winning index
        let mut rarity = ctx.accounts.hatcher.rarity_burned;
        let winning_hash = ctx.accounts.hatcher.winning_hash;
        let seed = u16::from_le_bytes(winning_hash[12..14].try_into().unwrap());
        let mut claim_data = ctx.accounts.claim_mask.load_mut()?;
        let claim_data_mask = &mut claim_data.mask;

        if winning_hash.iter().take(31).all(|a| *a == 0u8)
            && winning_hash[31] == 1u8
        {
            msg!("rarity burned is {} but missed winning hash so using 0");
            rarity = 0;
        }

        let rarity_original = rarity;
        let mut winning_index: Option<u16>;
        loop {
            winning_index = find_winning_index(seed, rarity as usize, claim_data_mask);
            if winning_index.is_none() {
                if rarity == 0 {
                    break;
                }

                rarity = rarity.checked_sub(1).unwrap();
            } else {
                break;
            }
        }
        //if didn't find and was top rarity, that sucks for the user
        if rarity == 3 {
            msg!("Dang, you won big but Dinos are exhausted, closing hatcher empty handed. Good day sir.");
            return Ok(())
        }
        //if didn't find, do the same thing but with ascending rarity
        if winning_index.is_none() {
            rarity = rarity_original + 1;
            loop {
                winning_index = find_winning_index(seed, rarity as usize, claim_data_mask);
                if winning_index.is_none() {
                    if rarity == 3 {
                        msg!("Dinos are exhausted, closing hatcher empty handed. Good day sir.");
                        return Ok(())
                    }

                    rarity = rarity.checked_add(1).unwrap();
                } else {
                    break;
                }
            }
        }
        let winning_index = winning_index.unwrap() as u64;
        msg!("winning_index {}", winning_index);

        //create the leaf hash
        let uri = format!("{}{}", "https://arweave.net/", uri);
        let name = format!("{}{}", "SolanaDINO Genesis Era #", name);
        let computed_hash = anchor_lang::solana_program::keccak::hashv(&[
            &winning_index.to_le_bytes(),
            name.as_bytes(),
            uri.as_bytes(),
        ])
        .0[0..16].try_into().unwrap();

        // verify the proof
        require!(
            verify(proof, MERKLE_ROOT, computed_hash),
            HatcherErrorCode::ProofFailure,
        );

        //mint the nft
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    authority: ctx.accounts.mint_authority.to_account_info(),
                    mint: ctx.accounts.dino_mint.to_account_info(),
                    to: ctx.accounts.dino_token_account.to_account_info(),
                },
                &[&[b"authority".as_ref(), &[ctx.bumps["mint_authority"]]]],
            ),
            1,
        )?;

        let metadata_program = &ctx.accounts.metadata_program;
        let dino_metadata_account = &ctx.accounts.dino_metadata_account;
        let dino_mint = &ctx.accounts.dino_mint;
        let mint_authority = &ctx.accounts.mint_authority;
        let dino_token_account = &ctx.accounts.dino_token_account;
        let owner = &ctx.accounts.owner;
        let token_program = &ctx.accounts.token_program;
        let system_program = &ctx.accounts.system_program;
        let rent = &ctx.accounts.rent;

        let collection_mint = &ctx.accounts.collection_mint;
        let collection_metadata = &ctx.accounts.collection_metadata;
        let collection_master_edition = &ctx.accounts.collection_master_edition;
        let collection_authority_record = &ctx.accounts.collection_authority_record;

        let creators = vec![
            Creator {
                address: mint_authority.key(),
                share: 0,
                verified: true,
            },
            Creator {
                address: Pubkey::from_str("DiNowpL64gkg3NxpdmP5ojZ5kA4n2LYPpFREscpZgmpV".as_ref())
                    .unwrap(),
                share: 100,
                verified: false,
            },
        ];

        //create the metaplex metadata
        let create_metadata = create_metadata_accounts_v3(
            metadata_program.key(),
            dino_metadata_account.key(),
            dino_mint.key(),
            mint_authority.key(),
            owner.key(),
            mint_authority.key(),
            name,
            "DINONFT".to_string(),
            uri,
            Some(creators),
            500,
            true,
            true,
            Some(Collection {
                key: collection_mint.key(),
                verified: false,
            }),
            None,
            None,
        );
        let accounts = [
            dino_metadata_account.to_account_info(),
            dino_mint.to_account_info(),
            mint_authority.to_account_info(),
            mint_authority.to_account_info(),
            owner.to_account_info(),
            metadata_program.to_account_info(),
            system_program.to_account_info(),
            rent.to_account_info(),
        ];
        invoke_signed(
            &create_metadata,
            &accounts,
            &[&[b"authority".as_ref(), &[ctx.bumps["mint_authority"]]]],
        )?;

        //set as sold
        let update_primary_sale = update_primary_sale_happened_via_token(
            metadata_program.key(),
            dino_metadata_account.key(),
            owner.key(),
            dino_token_account.key(),
        );
        let accounts = [
            dino_metadata_account.to_account_info(),
            owner.to_account_info(),
            dino_token_account.to_account_info(),
        ];
        invoke(&update_primary_sale, &accounts)?;

        //verify the collection
        let verify_collection = verify_sized_collection_item(
            metadata_program.key(),
            dino_metadata_account.key(),
            mint_authority.key(),
            owner.key(),
            collection_mint.key(),
            collection_metadata.key(),
            collection_master_edition.key(),
            Some(collection_authority_record.key()),
        );
        let accounts = [
            dino_metadata_account.to_account_info(),
            mint_authority.to_account_info(),
            owner.to_account_info(),
            collection_mint.to_account_info(),
            collection_metadata.to_account_info(),
            collection_master_edition.to_account_info(),
            collection_authority_record.to_account_info(),
        ];
        invoke_signed(
            &verify_collection,
            &accounts,
            &[&[b"authority".as_ref(), &[ctx.bumps["mint_authority"]]]],
        )?;

        //remove the mint authority
        set_authority(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                SetAuthority {
                    account_or_mint: dino_mint.to_account_info(),
                    current_authority: mint_authority.to_account_info(),
                },
                &[&[b"authority".as_ref(), &[ctx.bumps["mint_authority"]]]],
            ),
            AuthorityType::MintTokens,
            None,
        )?;

        Ok(())
    }

    pub fn get_winning_index(ctx: Context<GetWinningIndex>) -> Result<u16> {
        let winning_hash = ctx.accounts.hatcher.winning_hash;
        let seed = u16::from_le_bytes(winning_hash[12..14].try_into().unwrap());
        let claim_data = ctx.accounts.claim_mask.load()?;

        if winning_hash.iter().all(|a| *a == 0u8) {
            return err!(HatcherErrorCode::NeedAssignWinningHash);
        }

        let mut rarity = ctx.accounts.hatcher.rarity_burned;
        if winning_hash.iter().take(31).all(|a| *a == 0u8)
            && ctx.accounts.hatcher.winning_hash[31] == 1u8
        {
            msg!("rarity burned is {} but missed winning hash so using 0");
            rarity = 0;
        }

        //we're an immutable view, so fake the data
        let mut claim_data_mask = claim_data.mask.clone();

        let rarity_original = rarity;
        let mut winning_index: Option<u16>;
        loop {
            winning_index = find_winning_index(seed, rarity as usize, &mut claim_data_mask);
            if winning_index.is_none() {
                if rarity == 0 {
                    break;
                }

                rarity = rarity.checked_sub(1).unwrap();
            } else {
                break;
            }
        }
        //if didn't find and was top rarity, that sucks for the user
        if rarity == 3 {
            msg!("Dang, you won big but Dinos are exhausted, closing hatcher empty handed. Good day sir.");
            return Ok(0)
        }
        //if didn't find, do the same thing but with ascending rarity
        if winning_index.is_none() {
            rarity = rarity_original + 1;
            loop {
                winning_index = find_winning_index(seed, rarity as usize, &mut claim_data_mask);
                if winning_index.is_none() {
                    if rarity == 3 {
                        msg!("Dinos are exhausted, closing hatcher empty handed. Good day sir.");
                        return Ok(0)
                    }

                    rarity = rarity.checked_add(1).unwrap();
                } else {
                    break;
                }
            }
        }

        Ok(winning_index.unwrap())
    }
}

//shoot me
fn find_winning_index(seed: u16, rarity: usize, claim_data_mask: &mut [u8]) -> Option<u16> {
    //get the range of bucket items for this rarity
    let (start_index, len, last_byte_bits) = OFFSETS[rarity];
    let winning_bit_index = seed as usize % ((len - 1) * 8 + last_byte_bits as usize);

    // msg!(
    //     "start_index {}, len {}, last_byte_bits {}, winning bit index {}",
    //     start_index,
    //     len,
    //     last_byte_bits,
    //     winning_bit_index
    // );

    let winning_byte = winning_bit_index / 8;
    // msg!("winning_byte {}", winning_byte);
    let winning_bit = (winning_bit_index % 8) as usize;
    // msg!("winning_bit {}", winning_bit);
    let (second, first) =
        claim_data_mask[start_index..(start_index + len)].split_at_mut(winning_byte as usize);
    let search_iter = first.iter_mut().chain(second.iter_mut());
    let last_first_byte = len - 1 - winning_byte;
    // msg!("last_first_byte {}", last_first_byte);
    //is (byte index, bit index)
    if let Some((taken_byte, taken_bit)) = search_iter.enumerate().find_map(|(i, b)| {
        if let Some(a) = find_winning_bit(
            b,
            if i == last_first_byte {
                winning_bit % last_byte_bits
            } else {
                winning_bit
            },
            if i == last_first_byte {
                last_byte_bits
            } else {
                8
            },
        ) {
            Some((i, a))
        } else {
            None
        }
    }) {
        // msg!("taken_byte {}", taken_byte);
        // msg!("taken_bit {}", taken_bit);

        let mut aa = winning_byte + taken_byte;
        if aa >= len {
            aa -= len;
        }

        let winning_index_with_pad = (start_index * 8) + (aa * 8) + taken_bit;
        let padding: usize = OFFSETS
            .into_iter()
            .map(|(_, _, a)| a)
            .enumerate()
            .filter(|(i, _)| *i < rarity)
            .map(|(_, a)| 8 - a)
            .sum();
        // msg!("padding {}", padding);
        let winning_index = winning_index_with_pad - padding;

        // msg!("winning_index {}", winning_index);
        Some(winning_index.try_into().unwrap())
    } else {
        None
    }
}

fn find_winning_bit(byte: &mut u8, bit: usize, valid_bits: usize) -> Option<usize> {
    let mut i = bit;
    loop {
        if !byte.bit(i.into()) {
            byte.set_bit(i, true);
            return Some(i);
        }
        i += 1;
        //loop after valid space
        if i == valid_bits {
            i = 0;
        }
        //if back where started, break
        if i == bit {
            break;
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use crate::state::ClaimMask;

    use super::*;

    #[test]
    fn test_find_winning_index_wrap_exhaust_first_and_last() {
        msg!("rarity 0");
        //rarity 0
        {
            let claim_data_mask = &mut [0; ClaimMask::SPACE];
            let seed: u16 = 6100;
            let rarity: usize = 0;

            //exhaust last byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);

            //exhaust 1st byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            let w = find_winning_index(seed, rarity, claim_data_mask);

            assert_eq!(claim_data_mask[762], 31);
            assert_eq!(claim_data_mask[0], 255);
            assert_eq!(w, Some(12), "rarity {}", rarity);
        }

        msg!("\nrarity 1");
        //rarity 1
        {
            let claim_data_mask = &mut [0; ClaimMask::SPACE];
            let seed: u16 = 3499;
            let rarity: usize = 1;

            //exhaust last byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);

            //exhaust 1st byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            let w = find_winning_index(seed, rarity, claim_data_mask);

            assert_eq!(claim_data_mask[1200], 15);
            assert_eq!(claim_data_mask[763], 255);
            assert_eq!(w, Some(6112), "rarity {}", rarity);
        }

        msg!("\nrarity 2");
        //rarity 2
        {
            let claim_data_mask = &mut [0; ClaimMask::SPACE];
            let seed: u16 = 397;
            let rarity: usize = 2;

            //exhaust last byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);

            //exhaust 1st byte
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            find_winning_index(seed, rarity, claim_data_mask);
            let w = find_winning_index(seed, rarity, claim_data_mask);

            assert_eq!(claim_data_mask[1250], 63);
            assert_eq!(claim_data_mask[1201], 255);
            assert_eq!(w, Some(9614), "rarity {}", rarity);
        }

        msg!("\nrarity 3");
        //rarity 3
        {
            let claim_data_mask = &mut [0; ClaimMask::SPACE];
            let seed: u16 = 1;
            let rarity: usize = 3;

            //exhaust only byte
            find_winning_index(seed, rarity, claim_data_mask);
            let w = find_winning_index(seed, rarity, claim_data_mask);

            assert_eq!(claim_data_mask[1251], 3);
            assert_eq!(w, Some(9999), "rarity {}", rarity);
        }
    }

    #[test]
    fn test_find_winning_index_exhausted() {
        let claim_data_mask = &mut [0; ClaimMask::SPACE];

        for a in OFFSETS.into_iter().enumerate() {
            let rarity = a.0;
            let count = ((a.1 .1 - 1) * 8) + a.1 .2;
            msg!("rarity {} count {}", rarity, count);
            for _ in 0..(count - 1) {
                let seed: u16 = rand::random(); //anything
                let w = find_winning_index(seed, rarity, claim_data_mask);
                assert!(w.is_some(), "rarity {} early", rarity);
            }
            let seed: u16 = rand::random(); //anything
            let w = find_winning_index(seed, rarity, claim_data_mask);
            assert!(w.is_some(), "rarity {} last one", rarity);

            let seed: u16 = rand::random(); //anything
            let w = find_winning_index(seed, rarity, claim_data_mask);
            assert_eq!(w, None, "rarity {} exhausted", rarity);
        }
    }
}
