import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_TRIP_USER } from "../queries/addTrip";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Entypo from "@expo/vector-icons/Entypo";

const AddTripScreen = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [dateType, setDateType] = useState("");
  const [showTravelTipsModal, setShowTravelTipsModal] = useState(false);

  const tips = [
    "Make sure your phone and other devices are fully charged",
    "Carry a portable charger or power bank",
    "Have a backup of important documents in digital format",
    "Inform someone you trust about your travel plans",
    "Use a travel insurance plan to cover unexpected events",
    "Have local currency or a way to access money easily",
    "Familiarize yourself with local emergency contact numbers",
    "Pack a small first aid kit for minor injuries or illnesses",
    "Know the local transportation options and how to navigate them",
    "Stay hydrated and take regular breaks during your trip",
  ];

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
      const data = await addTrip({
        variables: {
          tripInput: {
            destination: destination || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        },
      });

      if (data) {
        Alert.alert("Success", data.addTrip);
        navigation.navigate("Profile");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleShowTravelTips = () => {
    setShowTravelTipsModal(true);
  };

  const handleCloseTravelTipsModal = () => {
    setShowTravelTipsModal(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
        }}
        style={styles.imageBackground}
      >
        <Image
          style={styles.backgroundImage}
          source={require("../../assets/travel.png")}
        />
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create New Trip</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={handleShowTravelTips}
            >
              <Entypo name="info" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.label}>Set Your Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Start Trip Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setDateType("start");
                  setShowStartDateCalendar(true);
                }}
              >
                <Text style={styles.dateText}>{startDate || "YYYY-MM-DD"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>End Trip Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setDateType("end");
                  setShowEndDateCalendar(true);
                }}
              >
                <Text style={styles.dateText}>{endDate || "YYYY-MM-DD"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 8, marginTop: 10 }}>
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
                  style={styles.closeButton}
                  onPress={() => setShowStartDateCalendar(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
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
                  style={styles.closeButton}
                  onPress={() => setShowEndDateCalendar(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Travel Tips Modal */}
          <Modal
            transparent={true}
            visible={showTravelTipsModal}
            onRequestClose={handleCloseTravelTipsModal}
          >
            <TouchableWithoutFeedback onPress={handleCloseTravelTipsModal}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.title}>Travel Tips</Text>
                    {tips.map((tip, index) => (
                      <View key={index} style={styles.tipWrapper}>
                        <Text style={styles.tipNumber}>{index + 1}.</Text>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleCloseTravelTipsModal}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
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
  imageBackground: {
    backgroundColor: "black",
    height: "100%",
    zIndex: 1,
  },
  backgroundImage: {
    position: "absolute",
    zIndex: 2,
    width: 400,
    height: 280,
    top: 30,
    alignSelf: "center",
    opacity: 0.5,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 3,
    top: "37%",
    height: "70%",
    shadowColor: "gray",
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 10,
  },
  infoButton: {
    padding: 10,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateInputContainer: {
    width: "48%",
  },
  dateInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
  },
  submitButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#7ec8e3",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  closeButton: {
    backgroundColor: "#7ec8e3",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tipWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tipNumber: {
    fontWeight: "bold",
    marginRight: 5,
  },
  tipText: {
    flex: 1,
  },
});

export default AddTripScreen;
