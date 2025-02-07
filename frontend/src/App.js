import { useState, useEffect } from "react";
import { HashConnect } from "hashconnect";

const API_BASE_URL = "https://hederapnl.onrender.com"; // Replace with your Render backend URL

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
