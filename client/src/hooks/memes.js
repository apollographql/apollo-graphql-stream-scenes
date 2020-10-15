import { gql, useApolloClient } from "@apollo/client";
import { useValue, useRepeater } from "@repeaterjs/react-hooks";
import { useEffect } from "react";

const MEME_SUBSCRIPTION = gql`
  subscription Meme {
    meme
  }
`;

export default function useMemes() {
  const client = useApolloClient();
  const [memes, push, stop] = useRepeater();

  useEffect(() => {
    const { unsubscribe } = client
      .subscribe({ query: MEME_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          push(data.meme);
        },
      });

    return () => {
      unsubscribe();
      stop();
    };
  }, [push, stop, client]);

  const value = useValue(async function* () {
    for await (const meme of memes) {
      yield { url: meme };
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  });

  return value || {};
}
