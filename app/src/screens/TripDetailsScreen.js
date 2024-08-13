import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  CREATE_PAYMENT,
  CREATE_REVIEW,
  GET_TRIPS_BY_ID,
} from "../queries/getTripById";
import { ActivityIndicator, Button, Modal } from "react-native-paper";
import { WebView } from "react-native-webview";
import { UPDATE_DATE } from "../queries/updateDateTrip";
import { Calendar } from "react-native-calendars";
import moment from "moment";

import ReviewModal from "../components/ReviewModal";
import { UPDATE_ACTIVITY_QUANTITY } from "../queries/updateQuantity";
import { useFocusEffect } from "@react-navigation/native";

export default function TripDetailsScreen({ route }) {
  console.log(route.params._id);
  const [pressed, setPressed] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modal, setModal] = useState(false);
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
  const [
    paymentFn,
    { loading: loadingPayment, error: errorPayment, data: dataPayment },
  ] = useMutation(CREATE_PAYMENT);
  const [
    reviewFn,
    { loading: loadingReview, error: errorReview, data: dataReview },
  ] = useMutation(CREATE_REVIEW);
  const [
    updateQuantityFn,
    { loading: loadingQuantity, error: errorQuantity, data: dataQuantity },
  ] = useMutation(UPDATE_ACTIVITY_QUANTITY);
  const { loading, error, data, refetch } = useQuery(GET_TRIPS_BY_ID, {
    variables: { tripId: route.params._id },
  });
  useEffect(() => {
    if (data && data.getTripById && data.getTripById.paymentStatus === "Paid") {
      setPaid(true);
    }
  }, [data]);

  console.log(data);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <Text>Error while finding trip: {JSON.stringify(route.params._id)}</Text>
    );
  }

  const totalPrice = data.getTripById.activities.reduce(
    (sum, activity) => sum + activity.price,
    0
  );

  const handleBuy = async () => {
    try {
      const result = await paymentFn({
        variables: { tripId: route.params._id, amount: totalPrice },
      });
      setPaymentUrl(result.data.createPayment.redirectUrl);
      setModal(true);
      setPaid(true);
    } catch (err) {
      console.log(err);
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
      console.log(error);
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

  const handleQuantity = async (newQuantity, tripId, activityId) => {
    try {
      const result = await updateQuantityFn({
        variables: { newQuantity, tripId, activityId },
      });
      console.log(result);
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading === false) {
    return (
      <>
        {modal && (
          <WebView
            style={styles.webview}
            source={{ uri: paymentUrl }}
            onNavigationStateChange={(navState) => {
              console.log(navState.url, "<==========navState.urlss");
              if (
                !navState.url.includes("https://app.sandbox.midtrans.com/snap")
              ) {
                setModal(false);
                setShowReviewModal(true);
              }
            }}
          />
        )}
        {!modal && (
          <ScrollView style={styles.container}>
            <Text style={styles.title}>{data.getTripById.destination}</Text>
            <Text style={styles.dates}>
              {moment(data.getTripById.startDate).format("DD MMM YYYY")} -{" "}
              {moment(data.getTripById.endDate).format("DD MMM YYYY")}
            </Text>

            {data.getTripById.activities.map((activity, index) => (
              <View key={index} style={styles.card}>
                <Image
                  source={{ uri: activity.Activity.imgUrls[0] }}
                  style={styles.image}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.activityTitle}>
                    {activity.Activity.title}
                  </Text>
                  {paid && (
                    <Button
                      onPress={() => {
                        setActiveCard(activity.activityId);
                        setShowReviewModal(true);
                      }}
                    >
                      Review
                    </Button>
                  )}
                  <View style={styles.barisBawah}>
                    <View style={styles.underContainer}>
                      <Text style={styles.subTitle}>Price:</Text>
                      <Text style={styles.price}>Rp{activity.price}</Text>
                    </View>
                    {paid && (
                      <Text style={styles.quantity}>
                        Tickets: {activity.quantity}
                      </Text>
                    )}
                    {!paid && (
                      <View style={styles.underContainer}>
                        <Text style={styles.subTitle}>Tickets: </Text>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => {
                              if (activity.quantity > 1) {
                                handleQuantity(
                                  activity.quantity - 1,
                                  route.params._id,
                                  activity.activityId
                                );
                                setPressed(pressed + 1);
                              }
                            }}
                          >
                            <Text style={styles.quantityButtonText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityCountText}>
                            {activity.quantity}
                          </Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => {
                              handleQuantity(
                                activity.quantity + 1,
                                route.params._id,
                                activity.activityId
                              );
                              setPressed(pressed + 1);
                            }}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
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
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setShowDateModal(true)}
            >
              <Text style={styles.updateButtonText}>Update Dates</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={async (reviewData) => {
            let { rating, review } = reviewData;
            // console.log(rating, review, activeCard)
            try {
              const result = await reviewFn({
                variables: {
                  activityId: activeCard,
                  content: review,
                  rating: rating,
                },
              });
              console.log("Review success!");
            } catch (error) {
              console.log("Error while reviewing:", error);
            }

            setActiveCard("");
          }}
        />
        {/* Update Date Modal */}
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
                  {newStartDate
                    ? moment(newStartDate).format("DD MMM YYYY")
                    : "Select Start Date"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDateType("end");
                  setShowEndDateCalendar(true);
                }}
              >
                <Text style={styles.input}>
                  {newEndDate
                    ? moment(newEndDate).format("DD MMM YYYY")
                    : "Select End Date"}
                </Text>
              </TouchableOpacity>
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowDateModal(false)}
                />
                <Button title="Update" onPress={handleUpdateDate} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Start Date Calendar Modal */}
        <Modal
          transparent={true}
          visible={showStartDateCalendar}
          onRequestClose={() => setShowStartDateCalendar(false)}
        >
          <View style={styles.calendarContainer}>
            <View style={styles.calendarContent}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [newStartDate]: { selected: true, selectedColor: "blue" },
                }}
                style={styles.calendar}
              />
              <Button
                title="Close"
                onPress={() => setShowStartDateCalendar(false)}
              />
            </View>
          </View>
        </Modal>
        {/* End Date Calendar Modal */}
        <Modal
          transparent={true}
          visible={showEndDateCalendar}
          onRequestClose={() => setShowEndDateCalendar(false)}
        >
          <View style={styles.calendarContainer}>
            <View style={styles.calendarContent}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [newEndDate]: { selected: true, selectedColor: "blue" },
                }}
                style={styles.calendar}
              />
              <Button
                title="Close"
                onPress={() => setShowEndDateCalendar(false)}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  subTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  underContainer: {
    flexDirection: "column",
  },
  reviewModalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  webview: {
    flex: 1,
    zIndex: 3,
    elevation: 3,
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
    justifyContent: "space-around",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    // backgroundColor: 'green',
    color: "green",
  },
  quantity: {
    fontSize: 16,
    marginBottom: 4,
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
    justifyContent: "center",
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1F1",
    marginTop: 3,
    borderRadius: 5,
    padding: 1,
  },
  quantityButton: {
    // backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 9,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  quantityCountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
