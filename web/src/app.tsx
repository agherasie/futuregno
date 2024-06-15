import { useState } from "preact/hooks";
import ProviderContext from "./context/ProviderContext";
import { GnoWSProvider } from "@gnolang/gno-js-client";
import { IAccountContext } from "./context/accountContext.types";
import { IProviderContext } from "./context/providerContext.types";
import Config from "./config.ts";
import AccountContext from "./context/AccountContext.ts";
import HomePage from "./pages/index.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WriteLetter from "./pages/new.tsx";

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/new",
      element: <WriteLetter />,
    },
  ]);

  return (
    <ProviderContext.Provider value={wsProvider}>
      <AccountContext.Provider value={accountContext}>
        <RouterProvider router={router} />
      </AccountContext.Provider>
    </ProviderContext.Provider>
  );
}

export default App;
