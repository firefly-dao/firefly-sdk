import { TESTNET_FIREFLY_API, MAINNET_FIREFLY_API } from "../constants/index.js";
import { axios } from "../utils/axios.js";
import { type IChain, type IToken } from "../types/index.js";
import { APIError } from '../utils/request.js';


interface ResponseData<T = any> {
  data: T;
  message: string;
  code: number;
}

export interface GetExecutionStatusParams {
  chainId: number;
  hash: string;
  baseApiUrl: string;
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
export function getExecutionStatus({ chainId, hash, baseApiUrl }: GetExecutionStatusParams) {
  return axios.get<ResponseData<ExecutionStatusResponse>>(`${baseApiUrl}/quote/transaction`, {
    params: {
      chainId: chainId,
      hash: hash,
    },
  })
}

interface PostActionApiBody {
  chainId: number;
  dstChainId: number;
  hash: string;
  wallet: string;
  dstWallet: string;
  fromToken: string;
  dstToken: string;
}


export function postActionApi(body: PostActionApiBody, baseApiUrl: string) {
  return axios.post(`${baseApiUrl}/action`, body)
}

/**
 * Get the list of chains
 * @param baseApiUrl  the base API URL
 * @returns the list of chains
 */
export async function getChainsApi(baseApiUrl: string): Promise<IChain[]> {
  try {
    const res = await axios.get<ResponseData<IChain[]>>(`${baseApiUrl}/quote/chains`)
    if (res.data.code !== 200) {
      throw new APIError(res?.data?.message, res.status, res.data)
    }
    return res.data.data.map(chain => ({
      name: chain.name,
      chainId: chain.chainId,
      aliasName: chain.aliasName,
      icon: chain.icon,
      explorer: chain.explorer,
      tags: chain.tags,
      depositContract: chain.depositContract,
      type: chain.type,
    }))
  } catch (error: any) {
    throw new APIError(error?.message, error?.status, error?.data)
  }
}


/**
 * Get the list of tokens
 * @param baseApiUrl  the base API URL
 * @returns 
 */

export interface GetTokenListParams {
  chainIds: number[];
  depositAddressOnly: boolean;
  term?: string; // token name
  address?: string; // token address
}
export async function getTokenListApi(queryTokenListParams: GetTokenListParams, baseApiUrl: string): Promise<IToken[]> {
  try {
    const res = await axios.post<ResponseData<IToken[]>>(`${baseApiUrl}/quote/token/list`, {
      ...queryTokenListParams
    })

    if (res.data.code !== 200) {
      throw new APIError(res?.data?.message, res.status, res.data)
    }
    return res.data.data.map(token => ({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimal,
      icon: token.icon,
      chainName: token.chainName,
      aliasName: token.aliasName,
      symbol: token.symbol,
      verified: token.verified,
    }))
  } catch (error: any) {
    throw new APIError(error?.message, error?.status, error?.data)
  }
}


export interface GetTokenPriceApiParams {
  tokenAddress: string
  chainId: number
}
export async function getTokenPriceApi({ tokenAddress, chainId }: GetTokenPriceApiParams): Promise<number> {
  try {
    const res = await axios.get<ResponseData<string>>(`${MAINNET_FIREFLY_API}/quote/token/price`, {
      params: {
        address: tokenAddress,
        chainId: chainId,
      }
    })

    if (res.data.code !== 200) {
      throw new APIError(res?.data?.message, res.status, res.data)
    }
    return Number(res.data.data)
  } catch (error: any) {
    throw new APIError(error?.message, error?.status, error?.data)
  }
}


export interface GetExecutionHistoryApiParams {
  walletList: string[]
  cursorId?: number
  fromChainId?: number;
  dstChainId?: number;
  startTime?: number;
  endTime?: number;

}
export async function getExecutionHistoryApi(body: GetExecutionHistoryApiParams, baseApiUrl: string): Promise<ExecutionStatusResponse[]> {
  try {
    const res = await axios.post<ResponseData<ExecutionStatusResponse[]>>(`${baseApiUrl}/quote/orders`, {
      ...body
    })
    if (res.data.code !== 200) {
      throw new APIError(res?.data?.message, res.status, res.data)
    }
    return res.data.data
  } catch (error: any) {
    throw new APIError(error?.message, error?.status, error?.data)
  }
}