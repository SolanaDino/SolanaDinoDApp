import { u64 } from "@saberhq/token-utils";
import { keccak_256 } from "js-sha3";

import { MerkleTree } from "./merkle-tree";

export class BalanceTree {
  private readonly _tree: MerkleTree;
  constructor(balances: { name: string; uri: string }[]) {
    this._tree = new MerkleTree(
      balances.map(({ name, uri }, index) => {
        return BalanceTree.toNode(index, name, uri);
      })
    );
  }

  static verifyProof(
    index: number,
    name: string,
    uri: string,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(index, name, uri);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  static toNode(index: number, name: string, uri: string): Buffer {
    const buf = Buffer.concat([
      new u64(index).toArrayLike(Buffer, "le", 8),
      Buffer.from(name),
      Buffer.from(uri),
    ]);
    return Buffer.from(keccak_256(buf), "hex").subarray(0,16);
  }

  getHexRoot(): string {
    return this._tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  getHexProof(index: number, name: string, uri: string): string[] {
    return this._tree.getHexProof(BalanceTree.toNode(index, name, uri));
  }

  getRoot(): Buffer {
    return this._tree.getRoot();
  }

  getProof(index: number, name: string, uri: string): Buffer[] {
    return this._tree.getProof(BalanceTree.toNode(index, name, uri));
  }
}
