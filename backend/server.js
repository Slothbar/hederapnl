require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HEDERA_MIRROR_API = "https://testnet.mirrornode.hedera.com/api/v1";

// Initialize Hedera Client
const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// Fetch Token Balances
app.get('/balances/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const response = await axios.get(`${HEDERA_MIRROR_API}/accounts/${accountId}/tokens`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch token balances" });
    }
});

// Fetch Live Token Prices
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
