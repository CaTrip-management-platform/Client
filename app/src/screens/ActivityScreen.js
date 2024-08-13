import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TimelineContext } from "../context/timelineContext";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRIPS_BY_CUSTOMER_ID } from "../queries/getTripsByCustomerId";
import { ADD_ACTIVITY_TO_TRIP } from "../queries/addActivityToTrip";
import * as SecureStore from "expo-secure-store";

const ActivityScreen = () => {
  const { timeline } = useContext(TimelineContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tripsData, setTripsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateError, setDateError] = useState("");

  const { loading, error, data } = useQuery(GET_TRIPS_BY_CUSTOMER_ID);
  const [addActivityToTripFn] = useMutation(ADD_ACTIVITY_TO_TRIP);
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await SecureStore.getItemAsync("_id");
      setUser(user);
    }
    fetchUserData()
    if (data && data.getTripsByCustomerId) {
      const filteredTrips = data.getTripsByCustomerId.filter(
        (trip) => trip.customerId == user && trip.paymentStatus === "Pending"
      );
      setTripsData(filteredTrips);
    }
  }, [data]);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setDateError("");
    setCalendarModalVisible(false);
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setSelectedDate(null);
    setDateError("");
  };

  const handleAddToTrip = async (trip) => {
    if (!selectedDate) {
      setDateError("Please select a date first.");
      return;
    }

    try {
      await addActivityToTripFn({
        variables: {
          activityInput: {
            tripId: trip._id,
            activityId: selectedItem.id,
            quantity: 1,
            activityDate: selectedDate,
          },
        },
      });
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("Error adding activity to trip", error);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  const keyExtractor = (item) =>
    item._id || item.id || `${item.title}-${item.date}`;

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading data.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
      }}
      style={styles.container}
    >
      <Text style={styles.timelineHeader}>Timeline</Text>

      {timeline.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text>No activities found.</Text>
        </View>
      ) : (
        <FlatList
          data={timeline}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOpenModal(item)}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineContainer}>
                    {item.imgUrls && item.imgUrls.length > 0 ? (
                      <Image
                        source={{ uri: item.imgUrls[0] }}
                        style={styles.timelineImage}
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>No Image</Text>
                      </View>
                    )}
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineRating}>
                      Rating: {item.reviews?.[0]?.rating || "N/A"}
                    </Text>
                    <Text>{item.name}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Success Message Modal */}
      <Modal
        transparent={true}
        visible={successModalVisible}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.successModalContent}>
            <Text style={styles.successText}>Activity added successfully!</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Trip</Text>
            {selectedItem ? (
              <>
                <TouchableOpacity
                  onPress={() => setCalendarModalVisible(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {selectedDate
                      ? `Selected Date: ${selectedDate}`
                      : "Select Date"}
                  </Text>
                </TouchableOpacity>
                {dateError ? (
                  <Text style={styles.errorText}>{dateError}</Text>
                ) : null}
                {tripsData.length > 0 ? (
                  <FlatList
                    data={tripsData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleAddToTrip(item)}
                        style={styles.card}
                      >
                        <Text style={styles.cardText}>{item.destination}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text>There's no trip available.</Text>
                )}
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>No trip details available.</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        transparent={true}
        visible={calendarModalVisible}
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.calendarModalBackground}>
          <View style={styles.calendarModalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#134B70",
                  selectedTextColor: "#FFFFFF",
                },
              }}
              theme={{
                selectedDayBackgroundColor: "#134B70",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: "#134B70",
              }}
            />
            <TouchableOpacity
              onPress={() => setCalendarModalVisible(false)}
              style={styles.closeButton}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  timelineHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    padding: 3,
    textAlign: "center",
    backgroundColor: "#134B70",
    color: "white",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#134B70",
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 25,
    paddingLeft: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#134B70",
    position: "relative",
  },
  timelineContainer: {
    backgroundColor: "white",
    padding: 10,
  },
  timelineImage: {
    width: "100%",
    height: 100,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineRating: {
    fontSize: 16,
    color: "#888",
  },
  placeholderImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  dateButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#134B70",
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarModalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  successModalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "green",
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default ActivityScreen;
