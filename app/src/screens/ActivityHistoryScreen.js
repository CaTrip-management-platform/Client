import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { GET_TRIPS_BY_CUSTOMER_ID } from "../queries/getTripsByCustomerId";
import { useNavigation } from "@react-navigation/native";

function ActivityHistoryScreen() {
  const [tripsId, setTripsId] = useState([]);
  const navigation = useNavigation();

  const fetchUserId = async () => {
    try {
      const userId = await SecureStore.getItemAsync("_id");
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const { loading, error, data } = useQuery(GET_TRIPS_BY_CUSTOMER_ID, {
    fetchPolicy: "no-cache",
    refetchOnWindowFocus: false,
    onCompleted: async (data) => {
      const userId = await fetchUserId();
      if (userId && data?.getTripsByCustomerId) {
        const filteredTrips = data.getTripsByCustomerId.filter(
          (trip) => trip.customerId === userId
        );
        setTripsId(filteredTrips);
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error! {error.message}</Text>;
  }

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("TripDetailScreen", { _id: item._id });
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.destination}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.startDate).toLocaleDateString()} -{" "}
          {new Date(item.endDate).toLocaleDateString()}
        </Text>
        <Text style={styles.cardDescription}>
          Total Price: {item.totalPrice.toLocaleString()}
        </Text>
        <Text style={styles.cardStatus}>
          Payment Status:{" "}
          <Text
            style={
              item.paymentStatus === "Paid"
                ? styles.paidStatus
                : styles.pendingStatus
            }
          >
            {item.paymentStatus}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={tripsId}
        keyExtractor={(item) => item._id}
        renderItem={renderTrip}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No trips found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  paidStatus: {
    color: "#28a745",
  },
  pendingStatus: {
    color: "#dc3545",
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
