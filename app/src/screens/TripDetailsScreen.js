import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Calendar } from "react-native-calendars";
import moment from "moment";

import { CREATE_PAYMENT, CREATE_REVIEW, GET_TRIPS_BY_ID } from "../queries/getTripById";
import { UPDATE_DATE } from "../queries/updateDateTrip";
import { DELETE_ACTIVITY } from "../queries/deleteActivity";
import ReviewModal from "../components/ReviewModal";
import { Button, Modal } from "react-native-paper";

export default function TripDetailsScreen({ route }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [dateType, setDateType] = useState("");
  const [paid, setPaid] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [activeCard, setActiveCard] = useState("");

  const [updateDate] = useMutation(UPDATE_DATE);
  const [paymentFn, { loading: loadingPayment, error: errorPayment }] = useMutation(CREATE_PAYMENT);
  const [reviewFn, { loading: loadingReview, error: errorReview }] = useMutation(CREATE_REVIEW);
  const [deleteActivityFn] = useMutation(DELETE_ACTIVITY);

  const { loading, error, data, refetch } = useQuery(GET_TRIPS_BY_ID, {
    variables: { tripId: route.params._id },
  });

  useEffect(() => {
    if (data && data.getTripById && data.getTripById.paymentStatus === "Paid") {
      setPaid(true);
    }
  }, [data]);

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const trip = data.getTripById;
  const totalPrice = trip.activities.reduce(
    (sum, activity) => sum + activity.price,
    0
  );

  const handleBuy = async () => {
    try {
      const result = await paymentFn({
        variables: { tripId: route.params._id, amount: totalPrice },
      });
      setPaymentUrl(result.data.createPayment.redirectUrl);
      setPaid(true);
    } catch (err) {
      console.log("Payment error:", err);
    }
  };

  const handleUpdateDate = async () => {
    try {
      await updateDate({
        variables: {
          dateInput: {
            startDate: newStartDate,
            endDate: newEndDate,
          },
          tripId: route.params._id,
        },
      });
      alert("Trip dates updated successfully!");
      setShowDateModal(false);
    } catch (error) {
      console.log("Update date error:", error);
      alert("Failed to update trip dates.");
    }
  };

  const handleDateSelect = (date) => {
    if (dateType === "start") {
      setNewStartDate(date.dateString);
      setShowStartDateCalendar(false);
    } else if (dateType === "end") {
      setNewEndDate(date.dateString);
      setShowEndDateCalendar(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivityFn({
        variables: {
          tripId: route.params._id,
          activityId: activityId,
        },
      });
      alert("Activity deleted successfully!");
      await refetch();
    } catch (error) {
      console.log("Error deleting activity:", error);
      alert("Failed to delete activity.");
    }
  };

  return (
    <>
      {paymentUrl && (
        <WebView
          style={styles.webview}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={(navState) => {
            if (!navState.url.includes("https://app.sandbox.midtrans.com/snap")) {
              setPaymentUrl(""); 
              setShowReviewModal(true);
            }
          }}
        />
      )}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{trip.destination}</Text>
        <Text style={styles.dates}>
          {moment(trip.startDate).format("DD MMM YYYY")} - {moment(trip.endDate).format("DD MMM YYYY")}
        </Text>

        {trip.activities.map((activity, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: activity.Activity.imgUrls[0] }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.activityTitle}>{activity.Activity.title}</Text>
              {paid && (
                <Button
                  mode="contained"
                  onPress={() => {
                    setActiveCard(activity.activityId);
                    setShowReviewModal(true);
                  }}
                >
                  Review
                </Button>
              )}
              {trip.paymentStatus === "Pending" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteActivity(activity.activityId)}
                >
                  <Text style={styles.deleteButtonText}>Delete Activity</Text>
                </TouchableOpacity>
              )}
              <View style={styles.barisBawah}>
                <Text style={styles.price}>Rp{activity.price}</Text>
                <Text style={styles.quantity}>Tickets: {activity.quantity}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalPrice}>Total Price: Rp{totalPrice}</Text>
        </View>

        {!paid && (
          <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.updateButton} onPress={() => setShowDateModal(true)}>
          <Text style={styles.updateButtonText}>Update Dates</Text>
        </TouchableOpacity>
      </ScrollView>

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={async (reviewData) => {
          try {
            await reviewFn({
              variables: {
                activityId: activeCard,
                content: reviewData.review,
                rating: reviewData.rating,
              },
            });
            console.log("Review success!");
            setActiveCard("");
          } catch (error) {
            console.log("Error while reviewing:", error);
          }
        }}
      />

      <Modal
        transparent={true}
        visible={showDateModal}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Dates</Text>
            <TouchableOpacity
              onPress={() => {
                setDateType("start");
                setShowStartDateCalendar(true);
              }}
            >
              <Text style={styles.input}>
                {newStartDate ? moment(newStartDate).format("DD MMM YYYY") : "Select Start Date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDateType("end");
                setShowEndDateCalendar(true);
              }}
            >
              <Text style={styles.input}>
                {newEndDate ? moment(newEndDate).format("DD MMM YYYY") : "Select End Date"}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={() => setShowDateModal(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleUpdateDate}>
                Update
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showStartDateCalendar}
        onRequestClose={() => setShowStartDateCalendar(false)}
      >
        <View style={styles.calendarContainer}>
          <View style={styles.calendarContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [newStartDate]: { selected: true, selectedColor: "blue" } }}
              style={styles.calendar}
            />
            <Button mode="contained" onPress={() => setShowStartDateCalendar(false)}>
              Close
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showEndDateCalendar}
        onRequestClose={() => setShowEndDateCalendar(false)}
      >
        <View style={styles.calendarContainer}>
          <View style={styles.calendarContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [newEndDate]: { selected: true, selectedColor: "blue" } }}
              style={styles.calendar}
            />
            <Button mode="contained" onPress={() => setShowEndDateCalendar(false)}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dates: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  barisBawah: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  quantity: {
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarContent: {
    width: "90%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  calendar: {
    width: "100%",
    height: 350,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
