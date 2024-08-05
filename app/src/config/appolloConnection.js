// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//   uri: "https://fcd0-103-18-34-247.ngrok-free.app",
//   cache: new InMemoryCache(),
// });

// export default client;
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://d072-103-18-34-247.ngrok-free.app",
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
