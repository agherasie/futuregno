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
      <div class="justify-center w-full text-center space-y-4">
        <h1 class="text-white text-3xl font-black">FutureGno</h1>
        <Connect />
      </div>
      <button
        class="text-white rounded-md p-2 text-sm bg-blue-600 hover:bg-blue-700"
        onClick={handleFetchPosts}
      >
        Fetch
      </button>
      <div class="space-y-6 py-4">
        {letters.map((letter) => (
          <div key={letter.id} class="p-4 rounded-md bg-gray-200 space-y-4">
            <div>
              <h2 class="italic">
                <b>From</b> {letter.author}
              </h2>
              <h2 class="italic">
                <b>To</b> {letter.recipient}
              </h2>
              <p class="italic">
                <b>Scheduled for</b>{" "}
                {new Date(letter.scheduledAt).toLocaleDateString("fr-FR")}
              </p>
              <p class="italic">
                <b>Sent at</b> {letter.sentAt}
              </p>
            </div>
            <p class="">{letter.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
