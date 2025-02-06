import { useState } from "react";
import { HashConnect } from "hashconnect";

function App() {
  const [accountId, setAccountId] = useState(null);
  const hashConnect = new HashConnect();

  async function connectWallet() {
    const appMetaData = {
      name: "Hedera P&L Tracker",
      description: "Track your Hedera token profits and losses",
      icon: "https://youriconurl.com"
    };

    const initData = await hashConnect.init(appMetaData, "testnet", true);
    hashConnect.connectToLocalWallet();
    
    const connectedAccount = initData.pairingData.accountIds[0];
    setAccountId(connectedAccount);
  }

  return (
    <div>
      <h1>Hedera P&L Tracker</h1>
      {accountId ? <p>Connected: {accountId}</p> : <button onClick={connectWallet}>Connect Wallet</button>}
    </div>
  );
}

export default App;
