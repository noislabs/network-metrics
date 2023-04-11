import { TendermintClient } from "npm:@cosmjs/tendermint-rpc";
import {
  Coin,
  coin,
  decodeCosmosSdkDecFromProto,
  QueryClient,
  setupBankExtension,
  setupDistributionExtension,
} from "npm:@cosmjs/stargate";

export async function totalSupply(tmClient: TendermintClient, searchDenom: string): Promise<Coin> {
  const queryClient = QueryClient.withExtensions(tmClient, setupBankExtension);
  return await queryClient.bank.supplyOf(searchDenom);
}

/* Queries the community pool funds in full unois. */
export async function communityPoolFunds(
  tmClient: TendermintClient,
  searchDenom: string,
): Promise<Coin> {
  const queryClient = QueryClient.withExtensions(tmClient, setupDistributionExtension);
  const resp = await queryClient.distribution.communityPool();
  const unois = resp.pool.find((coin) => coin.denom === searchDenom);
  if (!unois) {
    return coin(0, searchDenom);
  } else {
    const amount = decodeCosmosSdkDecFromProto(unois.amount).floor().toString();
    return coin(amount, searchDenom);
  }
}
