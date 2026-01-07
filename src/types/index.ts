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


export interface GetTokenListParams {
  chainIds: number[];
  depositAddressOnly: boolean;
  term?: string; // token name
  address?: string; // token address
}

export interface ExecutionStatusResponse {
  // 0: pending, 2: origin tx success, 2: destination tx success
  status: 0 | 2 | 1
  chainId: number
  fromAddress: string
  fromHash: string
  fromValue: string
  dstChainId: number
  dstHash: string | null
  dstAddress: string
  dstValue: string
  isRefund: 0 | 1
  fromTokenInfo: IToken
  dstTokenInfo: IToken
}

export interface GetExecutionStatusParams {
  chainId: number;
  hash: string;
  baseApiUrl: string;
}

export interface GetTokenPriceApiParams {
  tokenAddress: string
  chainId: number
}



export interface GetExecutionHistoryApiParams {
  walletList: string[]
  cursorId?: number
  fromChainId?: number;
  dstChainId?: number;
  startTime?: number;
  endTime?: number;

}

export type GetTokenBalancesApiParams = {
  chainId: number;
  token: string;
  wallet: string;
}[];

export type IGetMultiBalanceTokenApiRes = {
  view_value: string; // token balance
  status_code: number; // 0:success else error
  chainId: number;// chain id
  tokenAddress: string;// token address
}[];

export * from './Execute.js'
