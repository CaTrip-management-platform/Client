import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native-paper";
import Card from "../components/detailCard.js";
import { GET_POST_BY_ID } from "../queries/posts.js";

function DetailsScreen({ route }) {
  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { postId: route.params._id },
  });

  const [post, setPost] = useState({});
  useEffect(() => {
    if (data && data.findPostById) {
      setPost(data.findPostById);
    }
  }, [data]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
         <Card card={post} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
});

export default DetailsScreen;
