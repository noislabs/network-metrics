import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate";
import { Coin } from "npm:@cosmjs/stargate";
import { Decimal } from "npm:@cosmjs/math";
import { toUtf8 } from "npm:@cosmjs/encoding";
import {
  HttpBatchClient,
  Tendermint34Client,
} from "npm:@cosmjs/tendermint-rpc";
import * as promclient from "npm:prom-client";
import express from "npm:express@4.18.2";
import settings from "./settings.ts";
import { communityPoolFunds, getContractUsage, totalSupply } from "./queries.ts";

function printableCoin(coin: Coin): string {
  if (coin.denom?.startsWith("u")) {
    const ticker = coin.denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(coin.amount ?? "0", 6).toString() + " " + ticker;
  } else {
    return coin.amount + coin.denom;
  }
}

// mapping of channel IDs to customer
const channelDescriptions = {
  "channel-11": "gelotto-proxy",
  "channel-16": "example-proxy-1",
};

function mapChannelToDescription(channelId: string): string {
  // Default to a unknown if the channel is not found
  return channelDescriptions[channelId] || "unknown-proxy";
}

export interface Account {
  readonly name: string;
  readonly address: string;
  readonly denom: "unois";
}

function debugLog(msg: string) {
  Deno.stderr.writeSync(toUtf8(`[${new Date().toISOString()}] ` + msg + "\n"));
}

function errorLog(msg: string) {
  Deno.stderr.writeSync(toUtf8(`[${new Date().toISOString()}] ` + msg + "\n"));
}

if (import.meta.main) {
  const app = express();

  const balances = new Map<string, string>();

  const balancesGauge = new promclient.Gauge({
    name: "balances",
    help: "Account balances in NOIS",
    labelNames: ["account", "rpcEndpoint", "chainId"] as const,
  });

  const customerUsageGauge = new promclient.Gauge({
    name: "customer_usage",
    help: "Usage data per customer chain",
    labelNames: [
      "channel",
      "rpcEndpoint",
      "chainId",
      "description",
      "address",
    ] as const,
  });

  // Updates all gauges with the current balances
  const gaugify = () => {
    for (const [key, val] of balances.entries()) {
      balancesGauge.set(
        { account: key, rpcEndpoint, chainId },
        parseInt(val, 10) / 1_000_000
      );
    }
  };

  // deno-lint-ignore no-explicit-any
  app.get("/metrics", (_req: any, res: any) => {
    gaugify();
    updateContractUsage();

    res.set("Content-Type", promclient.register.contentType);
    promclient.register.metrics().then((metrics) => res.end(metrics));
  });

  const rpcEndpoint = Deno.env.get("RPC_ENDPOINT");
  if (!rpcEndpoint) {
    console.error("RPC_ENDPOINT environment variable is not defined");
    Deno.exit(1); // Exit the process with a non-zero code to indicate failure
  }
  const httpBatch = new HttpBatchClient(rpcEndpoint);
  const tmClient = await Tendermint34Client.create(httpBatch);
  const client = await CosmWasmClient.create(tmClient);

  const chainId = await client.getChainId();
  debugLog(`Connected to ${chainId} via ${rpcEndpoint}`);

  const accounts = settings[chainId].accounts;

  const updateAccounts = () => {
    // debugLog("Getting balances ...");
    for (const account of accounts) {
      client.getBalance(account.address, account.denom).then(
        (balance) => {
          debugLog(`${account.name}: ${printableCoin(balance)}`);
          balances.set(account.name, balance.amount);
        },
        (err) => errorLog(err.toString())
      );
    }
  };

  const updateTotalSupply = () => {
    totalSupply(tmClient, "unois").then(
      (balance) => {
        const exportAccountName = "total supply";
        debugLog(`${exportAccountName}: ${printableCoin(balance)}`);
        balances.set(exportAccountName, balance.amount);
      },
      (err) => errorLog(err.toString())
    );
  };

  const updateCommunityPool = () => {
    communityPoolFunds(tmClient, "unois").then(
      (balance) => {
        const exportAccountName = "community pool";
        debugLog(`${exportAccountName}: ${printableCoin(balance)}`);
        balances.set(exportAccountName, balance.amount);
      },
      (err) => errorLog(err.toString())
    );
  };

  const updateContractUsage = async () => {
    try {
      const contractState = await getContractUsage(
        tmClient,
        "nois1xwde9rzqk5u36fke0r9ddmtwvh43n4fv53c5vc462wz8xlnqjhls6d90xc"
      );

      // array of customer data
      for (const customer of contractState.customers) {
        const description = mapChannelToDescription(customer.channel_id); // Implement this mapping function
        customerUsageGauge.set(
          {
            channel: customer.channel_id,
            rpcEndpoint: rpcEndpoint,
            chainId: chainId,
            description: description,
            address: customer.payment,
          },
          customer.requested_beacons
        );
      }
    } catch (err) {
      errorLog(err.toString());
    }
  };

  // Initial call
  updateAccounts();
  updateTotalSupply();
  updateCommunityPool();
  updateContractUsage();

  setInterval(updateAccounts, 10_000);
  setInterval(updateTotalSupply, 45_000);
  setInterval(updateCommunityPool, 100_000);
  setInterval(updateContractUsage, 60_000);

  const port = 3000;
  app.listen(port, function () {
    debugLog(`Listening on port ${port} ...`);
  });
}
