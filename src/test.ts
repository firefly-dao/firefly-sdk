import { base } from "viem/chains";
import { FireflyClient } from "./client/client.js";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { LogLevel, MAINNET_FIREFLY_API } from "./constants/index.js";

async function main() {
  const client = new FireflyClient({
    baseApiUrl: MAINNET_FIREFLY_API, // required: MAINNET_FIREFLY_API | TESTNET_FIREFLY_API
    referrer: 'firefly-sdk', // options:  'YOUR.SOURCE' || 'CUSTOM NAME'
    logLevel: LogLevel.Info, // options: LogLevel.None | LogLevel.Info
  })

  const quote = await client.getQuote({
    "fromChainId": 8453,
    "fromTokenAddress":
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "recipient": "0x0955e7ad74ca25be76d7309532a40147e08ec8da",
    "amount": "600000",
    "toChainId": 42161,
    "toTokenAddress": "0xaf88d065e77c8cc2239327c5edb3a432268e5831"
  })

  console.dir(quote, { depth: null })


  const wallet = createWalletClient({
    chain: base,
    transport: http(),
    account: privateKeyToAccount(`0x`),
  })

  const response = await client.execute({
    quote,
    wallet: wallet,
  })

  console.dir(response, { depth: null })
}

main()

