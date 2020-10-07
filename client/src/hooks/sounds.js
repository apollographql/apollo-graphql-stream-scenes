import { gql, useApolloClient } from "@apollo/client";
import { useValue, useRepeater } from "@repeaterjs/react-hooks";
import { useEffect } from "react";

const SOUND_SUBSCRIPTION = gql`
  subscription Sound {
    sound
  }
`;

export default function useFollows() {
  const client = useApolloClient();
  const [sounds, push, stop] = useRepeater();

  useEffect(() => {
    const unsubscribe = client
      .subscribe({ query: SOUND_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          push(data.sound);
        },
      });

    return () => {
      unsubscribe();
      stop();
    };
  }, [push, stop, client]);

  const value = useValue(async function* () {
    for await (const sound of sounds) {
      yield { id: sound };
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

  return value;
}
