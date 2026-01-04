import { TESTNET_FIREFLY_API, MAINNET_FIREFLY_API } from "../constants/index.js";
import { axios } from "../utils/axios.js";
import { type IChain, type IToken } from "../types/index.js";


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
 * @returns 
 */
export function getChainsApi(baseApiUrl: string) {
  return axios.get<ResponseData<IChain[]>>(`${baseApiUrl}/quote/chains`)
}


/**
 * Get the list of tokens
 * @param baseApiUrl  the base API URL
 * @returns 
 */
export function getTokensApi(baseApiUrl: string) {
  return axios.get<ResponseData<IToken[]>>(`${baseApiUrl}/bridge/tokens`)
}


export interface GetTokenPriceApiParams {
  tokenAddress: string
  chainId: number
}
export function getTokenPriceApi({ tokenAddress, chainId }: GetTokenPriceApiParams) {
  const baseApiUrl = MAINNET_FIREFLY_API
  return axios.get(`${baseApiUrl}/quote/token/price`, {
    params: {
      address: tokenAddress,
      chainId: chainId,
    }
  })
}


export interface GetExecutionHistoryApiParams {
  walletList: string[]
  cursorId?: number
  fromChainId?: number;
  dstChainId?: number;
  startTime?: number;
  endTime?: number;

}
export function getExecutionHistoryApi(body: GetExecutionHistoryApiParams, baseApiUrl: string) {
  return axios.post(`${baseApiUrl}/quote/orders`, {
    ...body
  })
}