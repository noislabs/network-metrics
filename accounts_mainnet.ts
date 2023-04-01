import { Account } from "./main.ts";

export const accountsMainnet: Account[] = [
  {
    name: "community pool",
    address: "nois1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8khek98", // toBech32("nois", fromBech32("stars1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8nrnpzw").data)
    denom: "unois",
  },
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
];
