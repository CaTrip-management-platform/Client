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
import Feather from "@expo/vector-icons/Feather";

import ReviewModal from "../components/ReviewModal";
import { UPDATE_ACTIVITY_QUANTITY } from "../queries/updateQuantity";
import { useFocusEffect } from "@react-navigation/native";

export default function TripDetailsScreen({ route, navigation }) {
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
      if (newStartDate && date.dateString < newStartDate) {
        alert("End date cannot be before start date.");
        return;
      }
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
          <>
            <ScrollView style={styles.container}>
              <Text style={styles.title}>
                Destination: {data.getTripById.destination}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.dates}>
                  {moment(data.getTripById.startDate).format("DD MMM YYYY")} -{" "}
                  {moment(data.getTripById.endDate).format("DD MMM YYYY")}
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 10, marginBottom: 15 }}
                  onPress={() => setShowDateModal(true)}
                >
                  <Feather name="edit" size={18} color="black" />
                </TouchableOpacity>
              </View>
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
                        <Text style={styles.price}>
                          Rp. {activity.price.toLocaleString()}
                        </Text>
                        {paid && (
                          <Text style={styles.quantity}>
                            {activity.quantity}
                          </Text>
                        )}
                        {!paid && (
                          <View style={styles.underContainer}>
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
                </View>
              ))}
              {data.getTripById.activities.length < 1 && (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      marginVertical: 40,
                      fontSize: 20,
                    }}
                  >
                    No activities Added Yet
                  </Text>
                </View>
              )}
              {!paid && (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderRadius: 25,
                    paddingVertical: 12,
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    // console.log(navigation);
                    navigation.push("MainTab");
                  }}
                  disabled={loading}
                >
                  <Text
                    style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}
                  >
                    Add new activity
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            {data.getTripById.activities.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  backgroundColor: "white",
                  padding: 15,
                  elevation: 5,
                  width: "100%",
                }}
              >
                <View style={styles.totalContainer}>
                  <Text style={styles.totalPrice}>
                    Total Price: Rp. {totalPrice.toLocaleString()}
                  </Text>
                </View>
                {!paid && (
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={handleBuy}
                  >
                    <Text style={styles.buyButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}

        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={async (reviewData) => {
            let { rating, review } = reviewData;
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
          visible={showDateModal}
          onDismiss={() => setShowDateModal(false)}
          contentContainerStyle={styles.modalContent}
        >
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
            <Button mode="contained" onPress={() => setShowDateModal(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleUpdateDate}>
              Update
            </Button>
          </View>
        </Modal>

        {/* Start Date Calendar Modal */}
        <Modal
          visible={showStartDateCalendar}
          onDismiss={() => setShowStartDateCalendar(false)}
          contentContainerStyle={styles.calendarContent}
        >
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [newStartDate]: { selected: true, selectedColor: "blue" },
            }}
            style={styles.calendar}
          />
          <Button
            mode="contained"
            onPress={() => setShowStartDateCalendar(false)}
          >
            Close
          </Button>
        </Modal>
        {/* End Date Calendar Modal */}
        <Modal
          visible={showEndDateCalendar}
          onDismiss={() => setShowEndDateCalendar(false)}
          contentContainerStyle={styles.calendarContent}
        >
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [newEndDate]: { selected: true, selectedColor: "blue" },
            }}
            style={styles.calendar}
          />
          <Button
            mode="contained"
            onPress={() => setShowEndDateCalendar(false)}
          >
            Close
          </Button>
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
    flexDirection: "row",
    gap: 10,
    width: "auto",
    left: 5,
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
  modalContent: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: "auto",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
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
    flexDirection: "row",
    height: 120,
  },
  image: {
    width: "35%",
    height: "auto",
    aspectRatio: 1,
  },
  cardContent: {
    padding: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    height: 40,
    marginBottom: 8,
    width: 250,
  },
  barisBawah: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    color: "green",
    right: 20,
    top: 25,
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
    backgroundColor: "#7ec8e3",
    padding: 16,
    borderRadius: 30,
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
    backgroundColor: "#FFFFFF",
    marginTop: 3,
    borderRadius: 5,
    alignSelf: "flex-end",
    top: 20,
  },
  quantityButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  quantityCountText: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
