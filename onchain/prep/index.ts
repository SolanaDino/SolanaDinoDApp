//saved in ./supplied/
//this combines the supplied json into the form the merkle will use
import * as c1 from "./supplied/common1.json"
import * as c2 from "./supplied/common2.json"
import * as c3 from "./supplied/common3.json"
import * as uc1 from "./supplied/uncommon1.json"
import * as uc2 from "./supplied/uncommon2.json"
import * as r1 from "./supplied/rare1.json"
import * as r2 from "./supplied/rare2.json"
import * as m from "./supplied/mythical.json"

import * as fs from "fs";
import * as path from "path";
import { BalanceTree } from "./merkley"

async function main() {

  const dir = path.resolve(path.join(__dirname, 'output'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const common = Array.from(getData(c1)).reverse().concat(Array.from(getData(c2)).reverse(), Array.from(getData(c3)).reverse());
  const uncommon = Array.from(getData(uc1)).reverse().concat(Array.from(getData(uc2)).reverse());
  const rare = Array.from(getData(r1)).reverse().concat(Array.from(getData(r2)).reverse());
  const mythical = Array.from(getData(m)).reverse();
  

  const combined = Array.from(common.concat(uncommon, rare, mythical));
  const tree = new BalanceTree(combined);
  const withProofs = combined.map((a,i)=>({index:i, ...a, proof:tree.getProof(i, a.name, a.uri).map(a=>a.toString('base64'))}));

  fs.writeFileSync(path.join(dir, "info.json"), JSON.stringify({ merkleRoot:tree.getRoot().toString('base64'), common: common.length, uncommon: uncommon.length, rare: rare.length, mythical: mythical.length }));
  fs.writeFileSync(path.join(dir, "data.json"), JSON.stringify(Array.from(combined)));
  fs.writeFileSync(path.join(dir, "proofs.json"), JSON.stringify(withProofs));
}

function* getData(f: any): Iterable<{ uri: string, name: string }> {
  for (const d of Object.entries(f) as [string, any][])
    if (d[1].link)
      yield { uri: d[1].link, name: d[1].name }
}

main();
