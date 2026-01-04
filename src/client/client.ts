import { createPublicClient, http, type WalletClient } from 'viem';
import { type AxiosRequestConfig } from 'axios';
import { axios } from '../utils/axios.js';
import { getChainsApi, getExecutionHistoryApi, getExecutionStatus, getTokenPriceApi, getTokenListApi, postActionApi, type GetExecutionHistoryApiParams, type GetExecutionStatusParams, type GetTokenPriceApiParams, type GetTokenListParams, type ExecutionStatusResponse } from '../api/index.js';
import { APIError } from '../utils/request.js';
import { LogLevel, MAINNET_FIREFLY_API, TESTNET_FIREFLY_API } from '../constants/index.js';
import { handleWaitTransactionReceiptParams } from '../utils/index.js';
import { type Execute, type ExecuteResponse, type ExecuteProgressCallback } from '../types/Execute.js';
import { type IChain, type IToken } from '../types/index.js';

export interface GetQuoteParameters {
  fromChainId: number
  fromTokenAddress: string
  toChainId: number
  toTokenAddress: string
  amount: string
  recipient: string
  sender?: string
  referrer?: string
  slippageTolerance?: number
}

export type BaseApiUrl = typeof MAINNET_FIREFLY_API | typeof TESTNET_FIREFLY_API;

export class FireflyClient {
  baseApiUrl: BaseApiUrl;
  referrer?: string;
  logLevel?: LogLevel;



  constructor({ referrer = 'firefly-sdk', baseApiUrl, logLevel = LogLevel.Info }: { referrer?: string, baseApiUrl: BaseApiUrl, logLevel?: LogLevel }) {
    this.referrer = referrer;
    this.baseApiUrl = baseApiUrl;
    this.logLevel = logLevel;
  }

  async getQuote(parameters: GetQuoteParameters): Promise<Execute> {
    const { fromChainId, fromTokenAddress, toChainId, toTokenAddress, amount, recipient, sender, slippageTolerance } = parameters

    const query = {
      sender: sender || "0x000000000000000000000000000000000000dead",
      recipient,
      fromChainId,
      fromTokenAddress,
      toChainId,
      toTokenAddress,
      amount,
      referrer: this.referrer,
      ...(slippageTolerance && { slippageTolerance: slippageTolerance.toString() }),
    }

    const request: AxiosRequestConfig = {
      url: `${this.baseApiUrl}/quote`,
      method: 'post',
      data: query,
    }

    const res = await axios.request(request)

    if (res.data.code !== 200) {
      throw new APIError(res?.data?.message, res.status, res.data)
    }

    return { ...res.data.data, request }
  }

  async execute({ quote, wallet, onProgress }: { quote: Execute, wallet: WalletClient, onProgress?: ExecuteProgressCallback }): Promise<ExecuteResponse> {
    let response: ExecuteResponse = {
      status: 'idle',
      message: 'execute function: transaction execution incomplete'
    };

    const quoteRequest = quote.request;

    if (!quoteRequest) {
      return {
        status: 'failed',
        message: 'execute function: quote request information is missing',
      }
    }
    const publicClient = createPublicClient({
      chain: wallet.chain,
      transport: http(),
    });

    for (let i = 0; i < quote.steps.length; i++) {
      const step = quote.steps[i];
      if (step.id === 'approve') {
        try {
          this.logs('Starting approval...')
          const params = handleWaitTransactionReceiptParams(step)
          const approveHash = await wallet.sendTransaction(params);

          this.logs(`Approval tx hash: ${approveHash}.`)
          await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          })

          this.logs('Approval successful')
          onProgress?.({ step: 'approve', status: 'success', hash: approveHash });
        } catch (error) {
          onProgress?.({ step: 'approve', status: 'failed', error });
          return {
            status: 'failed',
            message: `execute function approve step failed: ${error}`,
          }
        }
      } else if (step.id === 'deposit') {
        this.logs('Starting deposit...')
        const txData = step.data;
        const params: any = {
          to: txData.to,
          value: BigInt(txData.value),
          data: txData.data,
          chainId: txData.chainId,
          kzg: undefined,
        };

        if (txData.maxFeePerGas)
          params.maxFeePerGas = BigInt(txData.maxFeePerGas);

        if (txData.maxPriorityFeePerGas)
          params.maxPriorityFeePerGas = BigInt(txData.maxPriorityFeePerGas);

        if (txData.gasLimit) params.gasLimit = BigInt(txData.gasLimit);

        // send transaction
        let tx: string
        try {
          tx = await wallet.sendTransaction(params);
          // send action to API
          postActionApi(
            {
              chainId: txData.chainId,
              dstChainId: quoteRequest.data.toChainId,
              hash: tx,
              wallet: wallet?.account?.address || '0x',
              dstWallet: quoteRequest.data.recipient,
              fromToken: quoteRequest.data.fromTokenAddress,
              dstToken: quoteRequest.data.toTokenAddress,
            },
            this.baseApiUrl)

          this.logs(`Deposit tx hash: ${tx}.`)
        } catch (err) {
          onProgress?.({ step: 'deposit', status: 'failed', error: err });
          return {
            status: 'failed',
            message: `execute function deposit step failed: ${err}`,
          }
        }

        // check transaction status
        try {
          while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
            const transaction = await getExecutionStatus(
              {
                chainId: quoteRequest.data.fromChainId,
                hash: tx,
                baseApiUrl: this.baseApiUrl
              });
            if (transaction.data.data.status !== 1) {
              continue;
            } else if (transaction.data.data.status === 1) {
              this.logs('Deposit successful.')
              this.logs(`Cross-chain successful. Tx hash: ${transaction.data.data.dstHash}.`)
              onProgress?.({ step: 'deposit', status: 'success', hash: transaction.data.data.dstHash || '' });
              response = {
                status: 'success',
                message: 'transaction successful'
              }
            }
            break;
          }
        } catch (err) {
          onProgress?.({ step: 'deposit', status: 'failed', error: err });
          return {
            status: 'failed',
            message: `execute function check transaction status failed: ${err}`,
          }
        }
      }
    }

    return response
  }

  queryFireflyChains(): Promise<IChain[]> {
    return getChainsApi(this.baseApiUrl)
  }

  queryTokenList(queryTokenListParams: GetTokenListParams): Promise<IToken[]> {
    return getTokenListApi(queryTokenListParams, this.baseApiUrl)
  }

  queryTokenPrice({ tokenAddress, chainId }: GetTokenPriceApiParams): Promise<number> {
    return getTokenPriceApi({ tokenAddress, chainId })
  }

  async queryExecutionStatus({ chainId, hash }: Omit<GetExecutionStatusParams, 'baseApiUrl'>): Promise<ExecutionStatusResponse> {
    try {
      const res = await getExecutionStatus({
        chainId,
        hash,
        baseApiUrl: this.baseApiUrl
      })
      if (res.data.code !== 200) {
        throw new APIError(res?.data?.message, res.status, res.data)
      }
      return res.data.data
    } catch (error: any) {
      throw new APIError(error?.message, error?.status, error?.data)
    }
  }

  queryExecutionHistory(queryParams: GetExecutionHistoryApiParams) {
    return getExecutionHistoryApi(queryParams, this.baseApiUrl)
  }

  private async logs(message: string) {
    if (this.logLevel === LogLevel.Info) {
      console.log(message)
    }
  }

}
