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
  aliasName: string;
  icon: string;
  explorer: string;
  tags: string[];
  depositContract?: `0x${string}`;
  // ALL = bridge +swap / limited = bridge
  type: 'All' | 'Limited';
}

export interface IToken {
  symbol: string;
  chainId: number;
  chainName: string;
  address: string;
  decimal?: number;
  decimals?: number;
  icon: string;
  aliasName: string;
  verified?: boolean;
}

export * from './Execute.js'
