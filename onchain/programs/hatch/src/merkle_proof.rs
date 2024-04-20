//! These functions deal with verification of Merkle trees (hash trees).
//! Direct port of https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0/contracts/cryptography/MerkleProof.sol

#[cfg(feature = "verbose")]
use anchor_lang::prelude::*;
use anchor_lang::solana_program;

/// Returns true if a `leaf` can be proved to be a part of a Merkle tree
/// defined by `root`. For this, a `proof` must be provided, containing
/// sibling hashes on the branch from the leaf to the root of the tree. Each
/// pair of leaves and each pair of pre-images are assumed to be sorted.
pub fn verify(proof: Vec<[u8; 16]>, root: [u8; 16], leaf: [u8; 16]) -> bool {
    #[cfg(feature = "verbose")]
    {
        msg!("{} root", format(&root));
        msg!("{} leaf", format(&leaf));
    }
    let mut computed_hash = leaf;
    for proof_element in proof.into_iter() {
        if computed_hash <= proof_element {
            #[cfg(feature = "verbose")]
            msg!(
                "{} computed hash\n\
                  <\n\
                  {} proof",
                format(&computed_hash),
                format(&proof_element)
            );

            // Hash(current computed hash + current element of the proof)
            computed_hash = solana_program::keccak::hashv(&[&computed_hash, &proof_element]).0[0..16].try_into().unwrap();
        } else {
            #[cfg(feature = "verbose")]
            msg!(
                "{} computed hash\n\
                  >\n\
                  {} proof",
                format(&computed_hash),
                format(&proof_element)
            );

            // Hash(current element of the proof + current computed hash)
            computed_hash = solana_program::keccak::hashv(&[&proof_element, &computed_hash]).0[0..16].try_into().unwrap();
        }
    }
    #[cfg(feature = "verbose")]
    msg!(
        "{} computed hash",
        format(&computed_hash),
    );
    // Check if the computed hash (root) is equal to the provided root
    computed_hash == root
}

#[cfg(feature = "verbose")]
fn format(bytes: &[u8; 32]) -> String {
    hex::encode(bytes)
}
