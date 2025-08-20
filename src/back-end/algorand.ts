// src/backend/algorand.ts

import algosdk from 'algosdk';

// Konfigurasi Algorand TestNet
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;
const algodToken = '';

// Membuat instance AlgodClient
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// AKUN TES SEMENTARA - JANGAN DILAKUKAN DI PROYEK NYATA
const userAccount = algosdk.generateAccount(); 
console.log('Akun pengirim:', userAccount.addr);

const candidateAddresses: { [key: string]: string } = {
    'Alice': '6V3S2B...ALICE',
    'Bob': '7A2P5R...BOB',
    'Charlie': '8C4T6K...CHARLIE',
};

export const sendVotingTransaction = async (selectedCandidate: string): Promise<string> => {
    try {
        // Ambil parameter transaksi terbaru dari jaringan
        const suggestedParams = await algodClient.getTransactionParams().do();
        
        const receiverAddress = candidateAddresses[selectedCandidate];
        if (!receiverAddress) {
            throw new Error('Alamat kandidat tidak ditemukan.');
        }

        // --- PERBAIKAN DI SINI ---
        // Menggunakan makePaymentTxnWithSuggestedParamsFromObject
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: userAccount.addr,
            receiver: receiverAddress, 
            amount: 1000, // 0.001 Algo
            closeRemainderTo: undefined,
            note: undefined,
            suggestedParams: suggestedParams,
        });

        const signedTxn = txn.signTxn(userAccount.sk);

        // --- PERBAIKAN DI SINI ---
        // Mendapatkan txId dari objek yang dikembalikan
        const txId = txn.txID().toString();
        await algodClient.sendRawTransaction(signedTxn).do();

        console.log(`Transaksi berhasil dikirim. TxID: ${txId}`);
        
        return txId;
    } catch (error) {
        console.error('Error saat mengirim transaksi:', error);
        throw error;
    }
};