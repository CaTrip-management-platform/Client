// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//   uri: "https://ea46-103-18-34-247.ngrok-free.app",
//   cache: new InMemoryCache(),
// });

// export default client;
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://9d91-139-194-135-159.ngrok-free.app",
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjFhYjFhMWY4YTUyMjI3MGE1OTlkMiIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MjI5MzA0MjN9.isSoaIjspAOrvuqVE8fR0corHO2V32CaLY2kX0BnBS0`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
