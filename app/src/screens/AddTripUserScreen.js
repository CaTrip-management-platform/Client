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
  ImageBackground,
  Image,
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
      <ImageBackground
        source={{
          uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
        }}
        style={{
          backgroundColor: "black",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Image
          style={{
            position: "absolute",
            zIndex: 2,
            width: 400,
            height: 280,
            top: 30,
            alignSelf: "center",
            opacity: 0.5,
          }}
          source={require("../../assets/travel.png")}
        />
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            zIndex: 3,
            top: "37%",
            height: "70%",
            shadowColor: "gray",
            elevation: 5,
          }}
        >
          <Text style={styles.title}>Create New Trip</Text>
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 16 }}>Start Trip Date</Text>
              <TouchableOpacity
                style={{ flex: 1, marginTop: 5 }}
                onPress={() => {
                  setDateType("start");
                  setShowStartDateCalendar(true);
                }}
              >
                <Text
                  style={[
                    styles.input,
                    { textAlign: "center", paddingTop: 15 },
                  ]}
                >
                  {startDate || "YYYY-MM-DD"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>End Trip Date</Text>
              <TouchableOpacity
                style={{ flex: 1, marginTop: 5 }}
                onPress={() => {
                  setDateType("end");
                  setShowEndDateCalendar(true);
                }}
              >
                <Text
                  style={[
                    styles.input,
                    { textAlign: "center", paddingTop: 15 },
                  ]}
                >
                  {endDate || "YYYY-MM-DD"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 8, marginTop: 70 }}>
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
                {loading ? "Submitting..." : "Create New Trip"}
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
                    [startDate]: { selected: true, selectedColor: "#7ec8e3" },
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#7ec8e3",
                    borderRadius: 25,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                  onPress={() => setShowStartDateCalendar(false)}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  style={{
                    backgroundColor: "#7ec8e3",
                    borderRadius: 25,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                  onPress={() => setShowEndDateCalendar(false)}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 50,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
    fontSize: 16,
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
