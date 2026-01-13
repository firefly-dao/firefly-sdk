import type { AxiosRequestConfig } from 'axios'

export type Execute = {
  steps: {
    id: "approve" | "deposit";
    action: string;
    data: {
      from: string;
      to: string;
      data: string;
      value: string;
      chainId: number;
      maxFeePerGas: string;
      maxPriorityFeePerGas: string;
      gas: string;
      gasPrice: string;
      gasLimit?: string;
    };
  }[];

  error?: any;

  fees: {
    senderGas: {
      amountUsd: string;
    };
    firefly: {
      amountUsd: string;
    };
    fireflyGas: {
      amountUsd: string;
    };
    fireflyService: {
      amountUsd: string;
    };
  };
  details: {
    router: { logo: string; name: string }[];
    timeEstimate: number;
    fromTimeEstimate: number;
    dstTimeEstimate: number;
    rate: string;
    totalImpact: {
      usd: string;
      percent: string;
    };
    swapImpact: {
      usd: string;
      percent: string;
    };
    currencyIn: {
      currency: {
        chainId: number;
        address: string;
        decimal: number;
        name: string;
        symbol: string;
        metadata: {
          logoURI: string;
        };
      };
      amount: string;
      amountFormatted: string;
      amountUsd: string;
      minimumAmount: string;
    };
    currencyOut: {
      currency: {
        chainId: number;
        address: string;
        decimal: number;
        name: string;
        symbol: string;
        metadata: {
          logoURI: string;
        };
      };
      amount: string;
      amountFormatted: string;
      amountUsd: string;
      minimumAmount: string;
    };
    slippageTolerance: {
      origin: {
        percent: string;
      };
      destination: {
        percent: string;
      };
    };
  };

  //Manually added request parameters that fetched the data
  request?: AxiosRequestConfig
}

export type ExecuteStep = NonNullable<Execute['steps']>
export type ExecuteStepItem = NonNullable<Execute['steps'][0]>


export type ExecuteResponse = {
  status: 'idle' | 'failed' | 'success';
  message: string
}

export interface ExecuteProgressInfo {
  step: 'approve' | 'deposit' | 'transaction_status';
  status: 'success' | 'failed';
  hash?: string;
  error?: any;
}

export type ExecuteProgressCallback = (info: ExecuteProgressInfo) => void;
