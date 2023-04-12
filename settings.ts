import { Account } from "./main.ts";

export interface ChainSettings {
  accounts: Account[];
}

const settings: Record<string, ChainSettings> = {
  "nois-1": {
    accounts: [
      {
        name: "drand",
        address: "nois19w26q6n44xqepduudfz2xls4pc5lltpn6rxu34g0jshxu3rdujzsj7dgu8",
        denom: "unois",
      },
      {
        name: "icecube",
        address: "nois1gwnfyx82rwgc4y9r8vx6nr9v35dwezw3dadw6h39mad9amg7shnsler5f0",
        denom: "unois",
      },
      {
        name: "sink",
        address: "nois10c0ppz0n57hqrmfp7g7lqs6k4xk9rxhvcfkqt83r8mars2lc57mq0f6cty",
        denom: "unois",
      },
    ],
  },
  "nois-testnet-005": {
    accounts: [
      {
        name: "drand",
        address: "nois14xef285hz5cx5q9hh32p9nztu3cct4g44sxjgx3dmftt2tj2rweqkjextk",
        denom: "unois",
      },
      {
        name: "icecube",
        address: "nois1gwnfyx82rwgc4y9r8vx6nr9v35dwezw3dadw6h39mad9amg7shnsler5f0",
        denom: "unois",
      },
      {
        name: "sink",
        address: "nois10c0ppz0n57hqrmfp7g7lqs6k4xk9rxhvcfkqt83r8mars2lc57mq0f6cty",
        denom: "unois",
      },
    ],
  },
};

export default settings;
