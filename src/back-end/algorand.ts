// src/back-end/algorand.ts

import algosdk from "algosdk";
import fs from "fs";
import path from "path";

// Algorand Client (using a stable testnet provider)
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;
const algodToken = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Local variables for relayer account and APP_ID
let relayerAccount: algosdk.Account | null = null;
let APP_ID = 0;

// Hardcoded Base64-encoded TEAL code
// This is the definitive version from PyTeal v0.23.0
const approvalBase64 = "I3ByYWdtYSB2ZXJzaW9uIDUEdHhuIEFwcGxpY2F0aW9uSUQgaW50IDAgPT0gYm56IG1haW5fbDggdHhuIE9uQ29tcGxldGlvbiBpbnQgTm9PcCA9PSBibnogbWFpbl9sNyB0eG4gT25Db21wbGV0aW9uIGludCBEZWxldGVBcHBsaWNhdGlvbiA9PSBibnogbWFpbl9sNiBpbnQgMSBibnogbWFpbl9sNSBlcnIg bWFpbl9sNTogaW50IDAgcmV0dXJuIG1haW5fbDY6IHR4biBTZW5kZXIgZ2xvYmFsIENyZWF0b3JBZGRyZXNzID09IGFzc2VydCBpbnQgMSByZXR1cm4gbWFpbl9sNzogdHhuIE51bUFwcEFyZ3MgaW50IDEgPT0gYXNzZXJ0IHR4bmEgQXBwbGljYXRpb25BcmdzIDAgYnl0ZSAiQWxpY2UiID09IHR4bmEgQXBwbGljYXRpb25BcmdzIDAgYnl0ZSAiQm9iIiA9PSB8fCB0eG5hIEFwcGxpY2F0aW9uQcmdcyAwIGJ5dGUgIkNoYXJsaWUiID09IHx8IGFzc2VydCB0eG5hIEFwcGxpY2F0aW9uQcmdcyAwIHR4bmEgQXBwbGljYXRpb25BcmdzIDAgYXBwX2dsb2JhbF9nZXQgaW50IDEgKyBhcHBfZ2xvYmFsX3B1dCBpbnQgMSByZXR1cm4gbWFpbl9sODogYnl0ZSAiQWxpY2UiIGludCAwIGFwcF9nbG9iYWxfcHV0IGJ5dGUgIkJvYiIgaW50IDAgYXBwX2dsb2JhbF9wdXQgb3V0ZCBieXRlICJDaGFybGllIiBpbnQgMCBhcHBfZ2xvYmFsX3B1dCBpbnQgMSByZXR1cm4=";
const clearBase64 = "I3ByYWdtYSB2ZXJzaW9uIDUgaW50IDEgcmV0dXJu";

/**
 * Gets the relayer account securely after .env is loaded.
 */
const getRelayerAccount = (): algosdk.Account => {
  if (relayerAccount) {
    return relayerAccount;
  }

  const mnemonic = process.env.RELAYER_MNEMONIC as string;
  if (!mnemonic) {
    throw new Error("RELAYER_MNEMONIC environment variable not set.");
  }

  relayerAccount = algosdk.mnemonicToSecretKey(mnemonic);
  return relayerAccount;
};

/**
 * Deploys the smart contract.
 */
export const deployVotingApp = async (candidates: string[]): Promise<number> => {
  try {
    const account = getRelayerAccount();
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // Get compiled TEAL from the hardcoded Base64 strings
    const approvalProgram = new Uint8Array(Buffer.from(approvalBase64, 'base64'));
    const clearProgram = new Uint8Array(Buffer.from(clearBase64, 'base64'));

    const appArgs = candidates.map((c) => new Uint8Array(Buffer.from(c)));

    const txn = algosdk.makeApplicationCreateTxnFromObject({
      sender: account.addr,
      suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram,
      clearProgram,
      numGlobalInts: 0,
      numGlobalByteSlices: candidates.length,
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
    const appArgs = [new Uint8Array(Buffer.from(candidate))];

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
      const key = Buffer.from(String(state.key), "base64").toString("utf-8");
      const value = Number(state.value?.uint ?? 0);
      results[key] = value;
    }
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