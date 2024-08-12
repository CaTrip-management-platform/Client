import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Modal, TouchableOpacity, TextInput } from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_TRIP_USER } from "../queries/addTrip";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from 'react-native-calendars';

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
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <TouchableOpacity onPress={() => { setDateType("start"); setShowStartDateCalendar(true); }}>
        <Text style={styles.input}>{startDate || "Start Date (YYYY-MM-DD)"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setDateType("end"); setShowEndDateCalendar(true); }}>
        <Text style={styles.input}>{endDate || "End Date (YYYY-MM-DD)"}</Text>
      </TouchableOpacity>
      <Button
        title={loading ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={loading}
      />
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
              markedDates={{ [startDate]: { selected: true, selectedColor: 'blue' } }}
            />
            <Button title="Close" onPress={() => setShowStartDateCalendar(false)} />
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
              markedDates={{ [endDate]: { selected: true, selectedColor: 'blue' } }}
            />
            <Button title="Close" onPress={() => setShowEndDateCalendar(false)} />
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
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default AddTripScreen;
