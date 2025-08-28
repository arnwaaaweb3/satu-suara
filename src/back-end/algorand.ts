// src/back-end/algorand.ts
import algosdk from "algosdk";
import fs from "fs";
import path from "path";


/**
 * Algorand TestNet config
 */
const algodServer = "https://testnet-api.algonode.cloud";
const algodPort = 443;
const algodToken = "";
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// RELAYER (host wallet)
const RELAYER_MNEMONIC = process.env.RELAYER_MNEMONIC as string;
if (!RELAYER_MNEMONIC) {
  throw new Error("RELAYER_MNEMONIC environment variable not set.");
}
const relayerAccount = algosdk.mnemonicToSecretKey(RELAYER_MNEMONIC);

let APP_ID = 0;

/**
 * Read TEAL file as Uint8Array
 */
const getTealBytes = (filename: string): Uint8Array => {
  const full = path.join(__dirname, "smart-contract", filename);
  const buffer = fs.readFileSync(full);
  return new Uint8Array(buffer);
};

/**
 * Deploy smart contract (Application Create) - accepts candidates array
 */
export const deployVotingApp = async (candidates: string[]): Promise<number> => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    const approvalProgram = getTealBytes("approval.teal");
    const clearProgram = new Uint8Array(0);

    // app args = daftar kandidat sebagai byte arrays
    const appArgs = candidates.map((c) => new Uint8Array(Buffer.from(c)));

    const txn = algosdk.makeApplicationCreateTxnFromObject({
      sender: relayerAccount.addr,
      suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram,
      clearProgram,
      // global schema: buat satu byte-slice per kandidat (kunci string)
      numGlobalInts: 0,
      numGlobalByteSlices: candidates.length,
      numLocalInts: 0,
      numLocalByteSlices: 0,
      appArgs,
    });

    const signedTxn = txn.signTxn(relayerAccount.sk);
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
 * Call / vote ke smart contract (relayer signs)
 */
export const callVotingApp = async (candidate: string): Promise<string> => {
  try {
    if (!APP_ID) throw new Error("Application not deployed yet!");

    const suggestedParams = await algodClient.getTransactionParams().do();
    const appArgs = [new Uint8Array(Buffer.from(candidate))];

    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: relayerAccount.addr,
      suggestedParams,
      appIndex: APP_ID,
      appArgs,
    });

    const signedTxn = txn.signTxn(relayerAccount.sk);
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
 * Ambil hasil voting dari global state
 */
export const getVotingResults = async (): Promise<{ [key: string]: number }> => {
  try {
    if (!APP_ID) throw new Error("Application not deployed yet!");

    const appInfo = await algodClient.getApplicationByID(APP_ID).do();
    const globalState = appInfo.params?.globalState ?? [];

    const results: { [key: string]: number } = {};

    for (const state of globalState) {
      // state.key biasanya base64 encoded string
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
 * Helper: set APP_ID manual (bermanfaat saat re-deploy / testing)
 */
export const setAppId = (appId: number) => {
  APP_ID = appId;
};

/**
 * Helper: get relayer address
 */
export const getRelayerAddress = () => relayerAccount.addr;
