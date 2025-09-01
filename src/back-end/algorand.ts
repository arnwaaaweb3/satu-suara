// src/back-end/algorand.ts

import algosdk from "algosdk";
import fs from "fs";
import path from "path";

// Algorand Client (using a stable testnet provider)
const algodServer = "https://testnet-api.algonode.cloud";
const algodPort = 443;
const algodToken = "";
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Local variables for relayer account and APP_ID
let relayerAccount: algosdk.Account | null = null;
let APP_ID = 0;

/**
 * Gets the relayer account securely after .env is loaded.
 */
const getRelayerAccount = (): algosdk.Account => {
  if (relayerAccount) return relayerAccount;

  const mnemonic = process.env.RELAYER_MNEMONIC as string;
  if (!mnemonic) {
    throw new Error("RELAYER_MNEMONIC environment variable not set.");
  }

  relayerAccount = algosdk.mnemonicToSecretKey(mnemonic);
  return relayerAccount;
};

/**
 * Compiles TEAL code from a file to bytecode.
 */
const compileTeal = async (filePath: string): Promise<Uint8Array> => {
  const tealCode = fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
  const compiled = await algodClient.compile(tealCode).do();
  return new Uint8Array(Buffer.from(compiled.result, "base64"));
};

/**
 * Deploys the smart contract.
 */
export const deployVotingApp = async (candidates: string[]): Promise<number> => {
  try {
    const account = getRelayerAccount();
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Compile TEAL from files
    const approvalProgram = await compileTeal("smart-contract/approval.teal");
    const clearProgram = await compileTeal("smart-contract/clear.teal");

    // Store candidate names encoded as UTF-8
    const appArgs = candidates.map((c) => new Uint8Array(Buffer.from(c, "utf-8")));

    const txn = algosdk.makeApplicationCreateTxnFromObject({
      sender: account.addr,
      suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram,
      clearProgram,
      numGlobalInts: candidates.length, // one int per candidate
      numGlobalByteSlices: candidates.length, // one byte slice per candidate name
      numLocalInts: 0,
      numLocalByteSlices: 0,
      appArgs,
    });

    const signedTxn = txn.signTxn(account.sk);
    const txId = txn.txID().toString();

    await algodClient.sendRawTransaction(signedTxn).do();
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    const appIndex = confirmedTxn.applicationIndex;
    if (!appIndex) throw new Error("Deployment failed — applicationIndex missing");

    APP_ID = Number(appIndex);
    console.log(`Voting dApp deployed! App ID: ${APP_ID}`);
    return APP_ID;
  } catch (err) {
    console.error("Error deploying application:", err);
    throw err;
  }
};

/**
 * Calls the smart contract to cast a vote.
 */
export const callVotingApp = async (candidate: string): Promise<string> => {
  try {
    const account = getRelayerAccount();
    if (!APP_ID) throw new Error("Application not deployed yet!");

    const suggestedParams = await algodClient.getTransactionParams().do();
    const appArgs = [new Uint8Array(Buffer.from(candidate, "utf-8"))];

    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: account.addr,
      suggestedParams,
      appIndex: APP_ID,
      appArgs,
    });

    const signedTxn = txn.signTxn(account.sk);
    const txId = txn.txID().toString();

    await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log(`Vote for ${candidate} sent! TxID: ${txId}`);
    return txId;
  } catch (err) {
    console.error("Error calling application:", err);
    throw err;
  }
};

/**
 * Fetches voting results from global state.
 */
export const getVotingResults = async (): Promise<{ [key: string]: number }> => {
  try {
    if (!APP_ID) throw new Error("Application not deployed yet!");

    const appInfo = await algodClient.getApplicationByID(APP_ID).do();
    const globalState = appInfo.params?.globalState ?? [];

    const results: { [key: string]: number } = {};
    for (const state of globalState) {
      // Decode the Base64 key properly to UTF-8 string
      const keyBase64 =
        typeof state.key === "string"
          ? state.key
          : Buffer.from(state.key).toString("base64");

      const decodedKey = Buffer.from(keyBase64, "base64").toString("utf-8");
      const value = Number(state.value?.uint ?? 0);

      results[decodedKey] = value;
    }

    console.log("Decoded Results:", results);
    return results;
  } catch (err) {
    console.error("Error fetching voting results:", err);
    throw err;
  }
};

/**
 * Helper function to manually set the App ID.
 */
export const setAppId = (appId: number) => {
  APP_ID = appId;
};
