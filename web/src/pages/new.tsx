import { FC, useCallback, useState } from "preact/compat";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import Config from "../config";

const WriteLetter: FC = () => {
  const [receiver, setReceiver] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);

  const handleSendLetter = useCallback(async () => {
    if (!receiver || !date || !body)
      throw new Error("invalid letter parameters");

    const accountInfo = await AdenaService.getAccountInfo();

    AdenaService.sendTransaction(
      [
        {
          type: EMessageType.MSG_CALL,
          value: {
            caller: accountInfo.address,
            send: "",
            pkg_path: Config.REALM_PATH,
            func: "WriteLetter",
            args: [receiver, body, "", new Date(date).getTime().toString()],
          },
        },
      ],
      5000000
    ).then(() => {
      setReceiver(null);
      setDate(null);
      setBody(null);
    });
  }, [receiver, date, body]);

  return (
    <div class="w-full p-8 space-y-8">
      <button
        onClick={() => {
          window.open(
            document.location.origin.split("/").slice(0, -1).join("/"),
            "_self"
          );
        }}
        class="text-white rounded-md p-2 text-sm bg-blue-600 hover:bg-blue-700"
      >
        Read letters
      </button>

      <div class="justify-center w-full text-center space-y-4">
        <h1 class="text-white text-3xl font-black">FutureGno</h1>
      </div>
      <div class="m-auto w-8/12 flex flex-col space-y-8">
        <div class="flex-row space-y-2">
          <p class="text-white font-bold">Receiver (address)</p>
          <div class="flex space-x-4">
            <input
              value={receiver ?? ""}
              class="p-2 w-full text-gray-800 bg-blue-200 rounded-md"
            />
            <button
              onClick={async () => {
                AdenaService.getAccountInfo().then((accountInfo) =>
                  setReceiver(accountInfo.address)
                );
              }}
              class="w-20 text-black bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Self
            </button>
          </div>
        </div>
        <textarea
          value={body ?? ""}
          onChange={(e) => setBody(e.currentTarget.value)}
          class="w-full h-64 p-2 text-gray-800 placeholder-gray-800 bg-blue-200 rounded-md"
          placeholder="Write your letter here..."
        />
        <div class="flex-row space-y-2">
          <p class="text-white font-bold">Date</p>
          <input
            onChange={(e) => setDate(e.currentTarget.value)}
            value={date ?? ""}
            type="date"
            class="p-2 w-full text-gray-800 bg-blue-200 rounded-md"
          />
        </div>
        <button
          onClick={handleSendLetter}
          class="w-full text-white rounded-md p-2 text-sm bg-blue-600 hover:bg-blue-700"
        >
          Send letter
        </button>
      </div>
    </div>
  );
};

export default WriteLetter;
