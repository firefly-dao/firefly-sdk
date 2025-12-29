import { axios } from "../utils/axios";

export function getSwapTransferStatusAPI({ chainId, hash }: { chainId: number, hash: string }) {
  return axios.get('https://api.fireflylabs.app/quote/transaction', {
    params: {
      chainId,
      hash,
    },
  })
}

export function actionReportApi(action: any) {
  return axios.post('https://api.fireflylabs.app/action', action)
}

export function getChainsApi() {
  return axios.get('https://api.fireflylabs.app/quote/chains')
}

export function getTokensApi() {
  return axios.get('https://api.fireflylabs.app/bridge/tokens')
}

export function postSpeedActionApi(action: any) {
  return axios.post('https://api.fireflylabs.app/action/speed', action)
}