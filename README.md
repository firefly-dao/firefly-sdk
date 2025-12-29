# Firefly SDK

A TypeScript SDK for cross-chain token transfers using the Firefly protocol.

## Installation

You can use the following ways to get the latest version of Firefly SDK:

**npm**

```bash
npm install @firefly-dao/firefly-sdk
```

**yarn**

```bash
yarn add @firefly-dao/firefly-sdk
```

**pnpm**

```bash
pnpm add @firefly-dao/firefly-sdk
```

## Quick Start

### Set up the SDK

```typescript
import {
  FireflyClient,
  MAINNET_FIREFLY_API,
  TESTNET_FIREFLY_API,
  LogLevel,
} from "@firefly-dao/firefly-sdk";

const client = new FireflyClient({
  baseApiUrl: MAINNET_FIREFLY_API, // or TESTNET_FIREFLY_API
  referrer: "firefly-sdk", // optional, default: 'firefly-sdk'
  logLevel: LogLevel.Info, // optional, default: LogLevel.Info
});
```

### Get a Quote

```typescript
const quote = await client.getQuote({
  fromChainId: 8453,
  fromTokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
  toChainId: 10,
  toTokenAddress: "0x0000000000000000000000000000000000000000", // USDC
  amount: "2000000", // 1 USDC (6 decimals)
  recipient: "0x...", // destination address
  sender: "0x...", // optional, source address
});

// Quote contains:
// - steps: Transaction steps (approve, deposit)
// - fees: Fee breakdown (gas, service fees)
// - details: Rate, impact, time estimate, currencies info
```

### Execute the Transfer

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// Connect wallet
const wallet = createWalletClient({
  chain: base,
  transport: http(),
  account: privateKeyToAccount(`0x`),
});

// Execute with progress tracking
const result = await client.execute({
  quote,
  wallet,
  onProgress: (info) => {
    console.log(`Step: ${info.step}`);
    console.log(`Status: ${info.status}`);

    if (info.status === "success") {
      console.log(`Transaction hash: ${info.hash}`);
    }

    if (info.status === "failed") {
      console.error(`Error: ${info.error}`);
    }
  },
});

if (result.status === "success") {
  console.log("✅ Cross-chain transfer completed!");
} else {
  console.error(`❌ Transfer failed: ${result.message}`);
}
```

## 📖 API Reference

### FireflyClient Constructor

```typescript
new FireflyClient(options: FireflyClientOptions)
```

**Parameters:**

| Parameter    | Type       | Required | Default         | Description                                                   |
| ------------ | ---------- | -------- | --------------- | ------------------------------------------------------------- |
| `baseApiUrl` | `string`   | Yes      | -               | API endpoint (`MAINNET_FIREFLY_API` or `TESTNET_FIREFLY_API`) |
| `referrer`   | `string`   | No       | `'firefly-sdk'` | Application identifier for tracking                           |
| `logLevel`   | `LogLevel` | No       | `LogLevel.Info` | Logging level (`Info` or `Silent`)                            |

---

### getQuote()

```typescript
async getQuote(parameters: GetQuoteParameters): Promise<Execute>
```

Fetches a quote for cross-chain token transfer.

**Parameters:**

| Parameter           | Type     | Required | Description                        |
| ------------------- | -------- | -------- | ---------------------------------- |
| `fromChainId`       | `number` | Yes      | Source chain ID                    |
| `fromTokenAddress`  | `string` | Yes      | Source token contract address      |
| `toChainId`         | `number` | Yes      | Destination chain ID               |
| `toTokenAddress`    | `string` | Yes      | Destination token contract address |
| `amount`            | `string` | Yes      | Amount in smallest unit            |
| `recipient`         | `string` | Yes      | Recipient address                  |
| `sender`            | `string` | No       | Sender address                     |
| `referrer`          | `string` | No       | Referrer                           |
| `slippageTolerance` | `string` | No       | Cross-chain slip pointID           |

**Returns:**

`Execute` object containing:

- `steps`: Array of transaction steps
- `fees`: Fee breakdown (gas, service fees)
- `details`: Transfer details (currencies, rate, impact, time estimate)

---

### execute()

```typescript
async execute(options: ExecuteOptions): Promise<ExecuteResponse>
```

Executes the cross-chain transfer.

**Parameters:**

| Parameter    | Type                      | Required | Description                |
| ------------ | ------------------------- | -------- | -------------------------- |
| `quote`      | `Execute`                 | Yes      | Quote from `getQuote()`    |
| `wallet`     | `WalletClient`            | Yes      | Viem wallet client         |
| `onProgress` | `ExecuteProgressCallback` | No       | Progress callback function |

**Progress Callback:**

```typescript
interface ExecuteProgressInfo {
  step: "approve" | "deposit";
  status: "success" | "failed";
  hash?: string;
  error?: any;
}
```

**Returns:**

```typescript
interface ExecuteResponse {
  status: "idle" | "failed" | "success";
  message: string;
}
```

## Complete Example

```typescript
import {
  FireflyClient,
  MAINNET_FIREFLY_API,
  LogLevel,
} from "@firefly-dao/firefly-sdk";
import { createWalletClient } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  // 1. Initialize client
  const client = new FireflyClient({
    baseApiUrl: MAINNET_FIREFLY_API,
    referrer: "my-dapp",
    logLevel: LogLevel.Info,
  });

  // 2. Setup wallet
  const wallet = createWalletClient({
    chain: base,
    transport: http(),
    account: privateKeyToAccount(`0x`),
  });

  try {
    // 3. Get quote
    console.log("Getting quote...");
    const quote = await client.getQuote({
      fromChainId: 8453,
      fromTokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
      toChainId: 10,
      toTokenAddress: "0x0000000000000000000000000000000000000000", // USDC
      amount: "2000000", // 1 USDC (6 decimals)
      recipient: "0x...", // destination address
      sender: "0x...", // optional, source address
    });

    console.log("Quote result:", quote);

    // 4. Execute transfer
    console.log("Executing transfer...");
    const result = await client.execute({
      quote,
      wallet,
      onProgress: (info) => {
        if (info.step === "approve") {
          console.log("Approval:", info.status);
        } else if (info.step === "deposit") {
          console.log("Deposit:", info.status);
        }

        if (info.hash) {
          console.log("Transaction:", info.hash);
        }
      },
    });

    if (result.status === "success") {
      console.log("Transfer completed successfully!");
    } else {
      console.error("Transfer failed:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```