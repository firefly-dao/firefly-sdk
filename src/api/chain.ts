import { TESTNET_FIREFLY_API, MAINNET_FIREFLY_API } from "../constants/index.js";
import axios from "axios";
export function getChainsApi(isTestnet: boolean = false) {
  const baseApiUrl = isTestnet ? TESTNET_FIREFLY_API : MAINNET_FIREFLY_API
  return axios.get(`${baseApiUrl}/quote/chains`)
}