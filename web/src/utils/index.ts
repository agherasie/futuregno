export const parsePostFetchResponse = (response: string) => {
  const regex = /\("(.*)".*\)/;
  const match = response.match(regex);

  if (!match || match.length < 2) {
    throw new Error("invalid post response");
  }

  const cleanResponse: string = match[1].replace(/\\"/g, '"');

  return JSON.parse(cleanResponse);
};
