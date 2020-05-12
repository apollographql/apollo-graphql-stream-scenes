import { useQuery, gql } from "@apollo/client";

export default () => {
  const { data, error } = useQuery(gql`
    query Channel {
      channel {
        title
      }
    }
  `);

  if (error) {
    console.error(error);
  }

  return data?.channel;
};
