import { gql, useApolloClient } from "@apollo/client";
import { useValue, useRepeater } from "@repeaterjs/react-hooks";
import { useEffect } from "react";

const RAID_SUBSCRIPTION = gql`
  subscription Follow {
    raid {
      userName
      viewers
    }
  }
`;

export default function useRaids() {
  const client = useApolloClient();
  const [raids, push, stop] = useRepeater();

  useEffect(() => {
    const unsubscribe = client
      .subscribe({ query: RAID_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          push(data.raid);
        },
      });

    return () => {
      unsubscribe();
      stop();
    };
  }, [push, stop, client]);

  const value = useValue(async function* () {
    for await (const raid of raids) {
      yield raid;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  });

  return value;
}
