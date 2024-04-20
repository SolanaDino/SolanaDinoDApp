export type Hatch = {
  version: "0.1.0";
  name: "hatch";
  instructions: [
    {
      name: "initClaimMask";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "claimMask";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "claim_mask";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "destroyClaimMask";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "claimMask";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "claim_mask";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "beginHatch";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "hatcher";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                path: "owner";
              }
            ];
          };
        },
        {
          name: "eggNftAcct";
          isMut: true;
          isSigner: false;
        },
        {
          name: "eggNftMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "assignWinningHash";
      accounts: [
        {
          name: "hatcher";
          isMut: true;
          isSigner: false;
        },
        {
          name: "slotHashes";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claimDino";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "hatcher";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "account";
                type: "publicKey";
                path: "owner";
              }
            ];
          };
        },
        {
          name: "feeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "claimMask";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "claim_mask";
              }
            ];
          };
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "authority";
              }
            ];
          };
        },
        {
          name: "dinoMint";
          isMut: true;
          isSigner: true;
        },
        {
          name: "dinoMetadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "dinoTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMetadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionMasterEdition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionAuthorityRecord";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "uri";
          type: "string";
        },
        {
          name: "name";
          type: "string";
        },
        {
          name: "proof";
          type: {
            vec: {
              array: ["u8", 16];
            };
          };
        }
      ];
    },
    {
      name: "getWinningIndex";
      accounts: [
        {
          name: "hatcher";
          isMut: false;
          isSigner: false;
        },
        {
          name: "claimMask";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "claim_mask";
              }
            ];
          };
        }
      ];
      args: [];
      returns: "u16";
    }
  ];
  accounts: [
    {
      name: "hatcher";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "slot";
            type: "u64";
          },
          {
            name: "winningHash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "rarityBurned";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "claimMask";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mask";
            type: {
              array: ["u8", 1252];
            };
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NoEligibleSlots";
      msg: "Dino has not begun developing";
    },
    {
      code: 6001;
      name: "NoConsecutiveSlots";
      msg: "Dino creation still in progress";
    },
    {
      code: 6002;
      name: "AttemptToMintWrongDino";
      msg: "An attempt was made to mint an nft type that was not correct";
    },
    {
      code: 6003;
      name: "DinosExhausted";
      msg: "No eligible winning dinos remain";
    },
    {
      code: 6004;
      name: "ProofFailure";
      msg: "Proof failed";
    }
  ];
};
