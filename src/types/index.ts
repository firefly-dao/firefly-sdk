export type ChainType =
  | 'Ton'
  | 'Fuel'
  | 'Eclipse'
  | 'Solana'
  | 'Soon'
  | 'Sui'
  | 'ICP'
  | 'Starknet'
  | 'Movement'
  | 'SvmBnb'
  | 'SvmBase'
  | 'SonicSVM'
  | 'Aptos'
  | 'EVM'
  | 'Tron'
  | 'ZksLite';


export type IChain = {
  name: string;
  chainId: number;
  netCode: number;
  aliasName: string;
  icon: string;
  explorer: string;
  tags: string[];
  orderWeight: number;
  fromOrder: number;
  dstOrder: number;
  depositContract?: `0x${string}`;
  index: number;
  cctp1?: `0x${string}`;
  cctp2?: `0x${string}`;
  skeys?: string[];
  domain: number;
  // ALL = bridge +swap / limited = bridge
  type: 'All' | 'Limited';
}

export interface IToken {
  symbol: string;
  chainId: number;
  chainName: string;
  address: string;
  decimal: number;
  decimals?: number;
  icon: string;
  name?: string;
  aliasName: string;
  verified?: boolean;
  refer: 'system' | 'chain';
  onChainName: string;
  onChainSymbol: string;
  currencyTags: {
    tagName: string;
    tagLogo: string;
  }[];
}

export * from './Execute.js'
