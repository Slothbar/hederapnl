// === Step 1: Backend Setup ===
// This is the backend for your Hedera P&L Tracker
// Deploy this on Render after pushing to GitHub

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HEDERA_MAINNET_MIRROR_API = "https://mainnet-public.mirrornode.hedera.com/api/v1";

// Fetch Token Balances from Hedera Public Mirror Node
app.get('/balances/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const response = await axios.get(`${HEDERA_MAINNET_MIRROR_API}/accounts/${accountId}/tokens`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch token balances" });
    }
});

// Fetch Transaction History
app.get('/transactions/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const response = await axios.get(`${HEDERA_MAINNET_MIRROR_API}/transactions?account.id=${accountId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transaction history" });
    }
});

// Fetch Live Token Prices (From CoinGecko API)
app.get('/prices/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch token prices" });
    }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// === Step 2: Frontend Setup ===
// This is the frontend React app for your Hedera P&L Tracker
// Ensure this is in the /frontend/src directory before pushing to GitHub

import { useState, useEffect } from "react";
import { HashConnect } from "hashconnect";

const API_BASE_URL = "https://your-backend.onrender.com"; // Replace with your Render backend URL

function App() {
  const [accountId, setAccountId] = useState(null);
  const [tokens, setTokens] = useState([]);
  const hashConnect = new HashConnect();

  async function connectWallet() {
    const appMetaData = {
      name: "Hedera P&L Tracker",
      description: "Track your Hedera token profits and losses",
      icon: "https://youriconurl.com"
    };

    const initData = await hashConnect.init(appMetaData, "mainnet", true);
    hashConnect.connectToLocalWallet();
    const connectedAccount = initData.pairingData.accountIds[0];
    setAccountId(connectedAccount);
    fetchBalances(connectedAccount);
  }

  async function fetchBalances(accountId) {
    const response = await fetch(`${API_BASE_URL}/balances/${accountId}`);
    const data = await response.json();
    setTokens(data.tokens);
  }

  return (
    <div>
      <h1>Hedera P&L Tracker</h1>
      {accountId ? <p>Connected: {accountId}</p> : <button onClick={connectWallet}>Connect Wallet</button>}
      <ul>
        {tokens.map(token => (
          <li key={token.token_id}>{token.token_id} - Balance: {token.balance}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
