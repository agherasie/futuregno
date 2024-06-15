import { useState } from "preact/hooks";
import ProviderContext from "./context/ProviderContext";
import { GnoWSProvider } from "@gnolang/gno-js-client";
import { IAccountContext } from "./context/accountContext.types";
import { IProviderContext } from "./context/providerContext.types";
import Config from "./config.ts";
import AccountContext from "./context/AccountContext.ts";
import HomePage from "./pages/index.tsx";

export function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainID, setChainID] = useState<string | null>(null);

  const accountContext: IAccountContext = {
    address,
    chainID,

    setAddress,
    setChainID,
  };

  const [provider, setProvider] = useState<GnoWSProvider | null>(
    new GnoWSProvider(Config.CHAIN_RPC)
  );

  const wsProvider: IProviderContext = {
    provider,
    setProvider,
  };

  return (
    <ProviderContext.Provider value={wsProvider}>
      <AccountContext.Provider value={accountContext}>
        <HomePage />
      </AccountContext.Provider>
    </ProviderContext.Provider>
  );
}

export default App;
