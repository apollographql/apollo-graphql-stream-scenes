import { useQuery, gql } from "@apollo/client";

export default () => {
  const { data, error } = useQuery(gql`
    query UpcomingStreams {
      streams {
        id
        title
        startTime
        date
      }
    }
  `);

  if (error) {
    console.error(error);
  }

  return data?.streams;
};
