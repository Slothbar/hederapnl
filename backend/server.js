require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HEDERA_MAINNET_MIRROR_API = "https://mainnet-public.mirrornode.hedera.com/api/v1";

// 🔹 Fetch Token Balances from Hedera Public Mirror Node
app.get('/balances/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const response = await axios.get(`${HEDERA_MAINNET_MIRROR_API}/accounts/${accountId}/tokens`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch token balances" });
    }
});

// 🔹 Fetch Transaction History
app.get('/transactions/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const response = await axios.get(`${HEDERA_MAINNET_MIRROR_API}/transactions?account.id=${accountId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transaction history" });
    }
});

// 🔹 Fetch Live Token Prices (From CoinGecko API)
app.get('/prices/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch token prices" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
