import { type ChainType } from '../types/index.js';
import { type Execute } from "../types/Execute.js";

export const handleWaitTransactionReceiptParams = (
  step: Execute['steps'][number],
) => {
  const params: any = {
    to: step.data.to as `0x${string}`,
    from: step.data.from as `0x${string}`,
    data: step.data.data as `0x${string}`,
    value: BigInt(step.data.value),
    chainId: step.data.chainId,
  };

  if (Number(step.data.gas)) {
    params.gas = BigInt(step.data.gas);
  }

  if (Number(step.data.gasPrice)) {
    params.gasPrice = BigInt(step.data.gasPrice || '0');
  }

  if (Number(step.data.maxFeePerGas)) {
    params.maxFeePerGas = BigInt(step.data.maxFeePerGas);
  }

  if (Number(step.data.maxPriorityFeePerGas)) {
    params.maxPriorityFeePerGas = BigInt(step.data.maxPriorityFeePerGas);
  }
  return params;
};


export const getEcoTypeByChainId = (chainId: number) => {
  const mapType: Record<number, ChainType> = {
    1024001: 'Ton',
    1024002: 'Fuel',
    1024003: 'Eclipse',
    1024004: 'Solana',
    1024005: 'Soon',
    1024006: 'Sui',
    1024007: 'ICP',
    1024008: 'Tron',
    1024009: 'Starknet',
    1024010: 'ZksLite',
    1024011: 'Movement',
    1024012: 'SvmBnb',
    1024013: 'SvmBase',
    1024014: 'SonicSVM',
    1024015: 'Aptos',
  };

  return mapType?.[chainId] || 'EVM';
};