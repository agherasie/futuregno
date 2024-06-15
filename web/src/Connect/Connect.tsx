import { FC } from "preact/compat";
import { useContext, useState } from "preact/hooks";
import AccountContext from "../context/AccountContext";
import { AdenaService } from "../services/adena/adena";
import { IAccountInfo } from "../services/adena/adena.types";
import { IConnectProps } from "./connect.types";
import Config from "../config";

const Connect: FC<IConnectProps> = () => {
  const { setChainID, setAddress, address } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleWalletConnect = async () => {
    setIsLoading(true);

    try {
      // Attempt to establish a connection
      await AdenaService.establishConnection("future.gno");

      // Get the account info
      const info: IAccountInfo = await AdenaService.getAccountInfo();

      // Make sure the network is valid
      await AdenaService.switchNetwork(Config.CHAIN_ID);

      // Update the account context
      setAddress(info.address);
      setChainID(Config.CHAIN_ID);
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <button
      class={`text-white rounded-md p-4 w-40 text-sm ${
        isLoading || !address
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      onClick={isLoading || !address ? undefined : handleWalletConnect}
    >
      {isLoading ? "CONNECTING..." : !address ? "CONNECTED" : "CONNECT WALLET"}
    </button>
  );
};

export default Connect;
