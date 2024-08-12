import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_TRIP_USER } from "../queries/addTrip";
import { useNavigation } from "@react-navigation/native";

const AddTripScreen = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addTrip, { data, loading, error }] = useMutation(ADD_TRIP_USER);


  const navigate = useNavigation();
  const handleSubmit = async () => {
    try {
      await addTrip({
        variables: {
          tripInput: {
            destination: destination || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        },
      });
      if (data) {
        Alert.alert("Success", data.addTrip.message)
      } 
      navigate.navigate("Profile")
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Trip</Text>
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button
        title={loading ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={loading}
      />
      {error && <Text style={styles.error}>Error: {error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default AddTripScreen;
