import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from 'jwt-decode';
import { GET_TRIPS_BY_CUSTOMER_ID } from "../queries/getTripsByCustomerId";

function ActivityHistoryScreen() {
  const [userId, setUserId] = useState("");

  const { loading, error, data } = useQuery(GET_TRIPS_BY_CUSTOMER_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  console.log(data)
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
           
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error! {error.message}</Text>;
  }

  const trips = data?.getTripsByCustomerId || [];

  const renderTrip = ({ item }) => (
    <View style={styles.card}>
   
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.destination}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
        </Text>
        <Text style={styles.cardDescription}>Total Price: {item.totalPrice}</Text>
        <Text style={styles.cardStatus}>Payment Status: {item.paymentStatus}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        renderItem={renderTrip}
        ListEmptyComponent={<Text style={styles.noDataText}>No trips found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 12,
    color: "#aaa",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ActivityHistoryScreen;
