import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate";
import { Coin } from "npm:@cosmjs/stargate";
import { Decimal } from "npm:@cosmjs/math";
import { toUtf8 } from "npm:@cosmjs/encoding";
import { HttpBatchClient, Tendermint34Client } from "npm:@cosmjs/tendermint-rpc";
import * as client from "npm:prom-client";

import { accountsMainnet } from "./accounts_mainnet.ts";
import { accountsTestnet } from "./accounts_testnet.ts";

function printableCoin(coin: Coin): string {
  if (coin.denom?.startsWith("u")) {
    const ticker = coin.denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(coin.amount ?? "0", 6).toString() + " " + ticker;
  } else {
    return coin.amount + coin.denom;
  }
}

export interface Account {
  readonly name: string;
  readonly address: string;
  readonly denom: "unois";
}

const accounts: Account[] = accountsTestnet;

function debugLog(msg: string) {
  Deno.stderr.writeSync(toUtf8(msg + "\n"));
}
function errorLog(msg: string) {
  Deno.stderr.writeSync(toUtf8(msg + "\n"));
}

if (import.meta.main) {
  const { default: config } = await import("./config.json", {
    assert: { type: "json" },
  });

  const balances = new Map<string, string>();

  const httpBatch = new HttpBatchClient(config.rpcEndpoint);
  const tmClient = await Tendermint34Client.create(httpBatch);
  const client = await CosmWasmClient.create(tmClient);

  setInterval(() => {
    debugLog("Getting balances ...");
    for (const account of accounts) {
      client.getBalance(account.address, account.denom).then((balance) => {
        debugLog(`${account.name}: ${printableCoin(balance)}`);
        balances.set(account.name, balance.amount);
      }, (err) => errorLog(err.toString()));
    }
  }, 10_000);
}
