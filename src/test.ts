// import { base } from "viem/chains";
// import { FireflyClient } from "./client/client.js";
// import { createWalletClient, http } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { LogLevel, MAINNET_FIREFLY_API } from "./constants/index.js";

async function main() {
  // const client = new FireflyClient({
  //   baseApiUrl: MAINNET_FIREFLY_API, // required: MAINNET_FIREFLY_API | TESTNET_FIREFLY_API
  //   referrer: 'firefly-sdk', // options:  'YOUR.SOURCE' || 'CUSTOM NAME'
  //   logLevel: LogLevel.Info, // options: LogLevel.None | LogLevel.Info
  // })

  // client.queryTokenBalances([
  //   {
  //     chainId: 8453,
  //     token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  //     wallet: "0x0955E7aD74ca25BE76d7309532a40147e08Ec8DA",
  //   }
  // ]).then(res => {
  //   console.dir(res, { depth: null })
  // })
  // chains test
  // client.queryFireflyChains().then(res => {
  //   console.dir(res, { depth: null })
  // })



  //token test
  // client.queryTokenList({
  //   chainIds: [8453],
  //   depositAddressOnly: false,
  // }).then(res => {
  //   console.dir(res, { depth: null })
  // })


  //token price test
  // client.queryTokenPrice({
  //   tokenAddress: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
  //   chainId: 8453,
  // }).then(res => {
  //   console.dir(res, { depth: null })
  // })

  //execution status test
  // client.queryExecutionStatus({
  //   chainId: 8453,
  //   hash: '0x339171dcdf2dd5c2df11ebe140f23ba68cb168b9e4a7d52a1ab422545784bbb9'
  // }).then(res => {
  //   console.dir(res, { depth: null })
  // })


  //execution history test
  // client.queryExecutionHistory({
  //   walletList: ['0x0955E7aD74ca25BE76d7309532a40147e08Ec8DA'],
  //   fromChainId: 8453,
  //   dstChainId: 42161,
  // }).then(res => {
  //   console.dir(res, { depth: null })
  // })


  // const quote = await client.getQuote({
  //   "fromChainId": 8453,
  //   "fromTokenAddress":
  //     "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  //   "recipient": "0x0955e7ad74ca25be76d7309532a40147e08ec8da",
  //   "amount": "300000",
  //   "toChainId": 42161,
  //   "toTokenAddress": "0xaf88d065e77c8cc2239327c5edb3a432268e5831"
  // })

  // console.dir(quote, { depth: null })


  // const wallet = createWalletClient({
  //   chain: base,
  //   transport: http(),
  //   account: privateKeyToAccount(`0x`),
  // })

  // const response = await client.execute({
  //   quote,
  //   wallet: wallet,
  // })

  // console.dir(response, { depth: null })
}

main()

