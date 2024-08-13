import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_TRIP_USER } from "../queries/addTrip";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

const AddTripScreen = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [dateType, setDateType] = useState("");

  const [addTrip, { data, loading, error }] = useMutation(ADD_TRIP_USER);
  const navigation = useNavigation();

  const handleDateSelect = (date) => {
    if (dateType === "start") {
      setStartDate(date.dateString);
      setShowStartDateCalendar(false);
    } else if (dateType === "end") {
      setEndDate(date.dateString);
      setShowEndDateCalendar(false);
    }
  };

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
        Alert.alert("Success", data.addTrip.message);
        navigation.navigate("Profile");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Trip</Text>
      <View>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          Set Your Destination
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Start Trip Date
          </Text>
          <TouchableOpacity
            style={{ flex: 1, marginTop: 5 }}
            onPress={() => {
              setDateType("start");
              setShowStartDateCalendar(true);
            }}
          >
            <Text
              style={[styles.input, { textAlign: "center", paddingTop: 15 }]}
            >
              {startDate || "YYYY-MM-DD"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            End Trip Date
          </Text>
          <TouchableOpacity
            style={{ flex: 1, marginTop: 5 }}
            onPress={() => {
              setDateType("end");
              setShowEndDateCalendar(true);
            }}
          >
            <Text
              style={[styles.input, { textAlign: "center", paddingTop: 15 }]}
            >
              {endDate || "YYYY-MM-DD"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 60 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#7ec8e3",
            borderRadius: 25,
            paddingVertical: 12,
            alignItems: "center",
            marginVertical: 10,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>Error: {error.message}</Text>}

      {/* Calendar Modals */}
      <Modal
        transparent={true}
        visible={showStartDateCalendar}
        onRequestClose={() => setShowStartDateCalendar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [startDate]: { selected: true, selectedColor: "blue" },
              }}
            />
            <Button
              title="Close"
              onPress={() => setShowStartDateCalendar(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showEndDateCalendar}
        onRequestClose={() => setShowEndDateCalendar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [endDate]: { selected: true, selectedColor: "blue" },
              }}
            />
            <Button
              title="Close"
              onPress={() => setShowEndDateCalendar(false)}
            />
          </View>
        </View>
      </Modal>
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
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    borderRadius: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default AddTripScreen;
