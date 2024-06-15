import { FC, useCallback, useContext, useState } from "preact/compat";
import Connect from "../Connect/Connect";
import ProviderContext from "../context/ProviderContext";
import Config from "../config";
import { parsePostFetchResponse } from "../utils";
import { AdenaService } from "../services/adena/adena";
import { EMessageType, IAccountInfo } from "../services/adena/adena.types";
import { Letter } from "../types/letter";

const HomePage: FC = () => {
  const { provider } = useContext(ProviderContext);
  const [letters, setLetters] = useState<Letter[]>([]);

  const handleFetchPosts = useCallback(async () => {
    if (!provider) {
      throw new Error("invalid chain RPC URL");
    }

    const accountInfo: IAccountInfo = await AdenaService.getAccountInfo();

    const tx = await AdenaService.sendTransaction(
      [
        {
          type: EMessageType.MSG_CALL,
          value: {
            caller: accountInfo.address,
            send: "",
            pkg_path: Config.REALM_PATH,
            func: "GetLettersJSON",
            args: null,
          },
        },
      ],
      5000000
    );

    const response = parsePostFetchResponse(
      atob(tx.deliver_tx.ResponseBase.Data!)
    );

    // const response: string = await provider.evaluateExpression(
    //   Config.REALM_PATH,
    //   `GetLettersJSON()`
    // );

    setLetters(response);
  }, [provider]);

  return (
    <div class="w-full p-8">
      <div class="flex space-x-4">
        <button
          onClick={() => {
            window.open(document.location.origin + "/new", "_self");
          }}
          class="text-white rounded-md p-2 text-sm bg-blue-600 hover:bg-blue-700"
        >
          Write a letter
        </button>
        <button
          class="text-white rounded-md p-2 text-sm bg-blue-600 hover:bg-blue-700"
          onClick={handleFetchPosts}
        >
          Fetch
        </button>
      </div>
      <div class="justify-center w-full text-center space-y-4">
        <h1 class="text-white text-3xl font-black">FutureGno</h1>
        <Connect />
      </div>

      <div class="space-y-6 py-8 ">
        {letters.map((letter) => (
          <div key={letter.id}>
            <p class="text-gray-500">
              Available since{" "}
              {new Date(letter.scheduledAt).toLocaleDateString("fr-FR")}
            </p>
            <div class="p-4 rounded-md bg-gray-300 space-y-4">
              <span class="w-full text-gray-800">
                <p class="font-bold">
                  <b>Letter from</b> {letter.sentAt.toString().split(" ")[0]}
                </p>
                <br />
                <p>Dear {letter.recipient},</p>
                <br />
                <p>{letter.body}</p>
                <br />
                <p class="text-right">From {letter.author}</p>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
