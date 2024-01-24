import { Account } from "./main.ts";

export interface ChainSettings {
  accounts: Account[];
  gatewayAddr: string;
  mappingChannels: Record<string, string>
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
      {
        name: "dev-fund",
        address: "nois13t0dg6503xafyclj8q9e7kpvwaq0dsrq0g8j6a",
        denom: "unois",
      },
      {
        name: "drand-fund",
        address: "nois1w6t2stuw6m384838yhpyghac7y98c7f4jk4m58",
        denom: "unois",
      },
    ],
    gatewayAddr: "nois1acyc05v6fgcdgj88nmz2t40aex9nlnptqpwp5hf8hwg7rhce9uuqgqz5wp",
    mappingChannels: {
      "channel-11": "gelotto-proxy",
      "channel-2": "juno-nois-team",
      "channel-20": "injective-governance",
      "channel-22": "architech",
      "channel-35": "aura-team",
      "channel-38": "stargaze-governance",
      "channel-41": "osmosis-nois-team",
    }
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
    gatewayAddr: "nois1xwde9rzqk5u36fke0r9ddmtwvh43n4fv53c5vc462wz8xlnqjhls6d90xc",
    mappingChannels: {
      "channel-17": "juno-nois-team",
      "channel-36": "injective-nois-team",
    }
  },
};

export default settings;

