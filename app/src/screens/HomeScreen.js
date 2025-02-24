import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useQuery, useApolloClient, gql, useMutation } from "@apollo/client";
import { GET_Activity } from "../queries/getAllActivity";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DELETE_ACTIVITY } from "../queries/delete";
import * as SecureStore from "expo-secure-store";
import Recommended from "../components/recommended";
import { TimelineContext } from "../context/timelineContext";
import Carousel from "../components/Carousel";
import ActivityStar from "../components/ActivityStar";
import DetailCarousel from "../components/DetailCarousel";

const HomeScreen = ({ searchResults, isFocused, navigation }) => {
  const navigate = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const { addToTimeline } = useContext(TimelineContext);
  const [role, setRole] = useState("customer");
  const client = useApolloClient();
  const { loading, error, data, refetch } = useQuery(GET_Activity);
  const [deleteActivity, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_ACTIVITY);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("role");
        console.log("role", storedRole);
        setRole(storedRole);
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };

    fetchRole();
  }, []);

  const sendMessage = async () => {
    try {
      const { data } = await client.query({
        query: gql`
          query Query($message: String!) {
            getTravelSupport(message: $message) {
              message
            }
          }
        `,
        variables: { message: userMessage },
      });
      setAiMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: userMessage },
        { type: "ai", text: data.getTravelSupport.message },
      ]);
      setUserMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (loading || deleteLoading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  const formatPrice = (price) => `Rp.${price.toLocaleString("id-ID")},-`;

  const activities =
    searchResults.length > 0
      ? searchResults.map((activity) => ({
          id: activity._id,
          name: activity.title,
          rating:
            activity.reviews && activity.reviews.length > 0
              ? activity.reviews
                  .map((review) => review.rating)
                  .reduce((a, b) => a + b) / activity.reviews.length
              : "N/A",
          location: activity.location || "Unknown Location",
          price: formatPrice(activity.price),
          image:
            activity.imgUrls && activity.imgUrls.length > 0
              ? activity.imgUrls[0]
              : "https://via.placeholder.com/150",
          description: activity.description,
          coords: activity.coords,
          imgUrls: activity.imgUrls || [],
        }))
      : data.getAllActivity.map((activity) => ({
          id: activity._id,
          name: activity.title,
          rating:
            activity.reviews && activity.reviews.length > 0
              ? activity.reviews
                  .map((review) => review.rating)
                  .reduce((a, b) => a + b) / activity.reviews.length
              : "N/A",
          location: activity.location || "Unknown Location",
          price: formatPrice(activity.price),
          image:
            activity.imgUrls && activity.imgUrls.length > 0
              ? activity.imgUrls[0]
              : "https://via.placeholder.com/150",
          description: activity.description,
          coords: activity.coords,
          imgUrls: activity.imgUrls || [],
        }));

  const ListHeader = () => (
    <View
      style={{
        ...styles.headerContainer,
        height: 200,
      }}
    >
      <View style={{ ...styles.headerContent, flexDirection: "column" }}>
        <Text style={styles.sectionTitle}>Recommended</Text>
      </View>
      <Recommended />
    </View>
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : selectedActivity.imgUrls.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < selectedActivity.imgUrls.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleAddToTimeline = () => {
    setActivityModalVisible(false);
    addToTimeline(selectedActivity);
    alert("Activity added to your timeline!");
  };

  const saveActivity = () => {
    addToTimeline(selectedActivity);
    Alert.alert("Success", "Activity added to your timeline!");
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteActivity({
        variables: { activityId: id },
      });
      setSelectedActivity(null);
      // console.log(result.data?.deleteActivityForSeller);
      refetch();
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
      }}
      style={styles.backgroundImage}
    >
      <ScrollView>
        {!isFocused && searchResults.length < 1 ? (
          <View>
            <Carousel />
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 5,
              }}
            >
              Popular Activities
            </Text>
          </View>
        ) : (
          <></>
        )}
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedActivity(item);
                setCurrentImageIndex(0);
                setActivityModalVisible(true);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <ActivityStar rating={item.rating} />
                <Text style={styles.cardLocation}>{item.location}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Modal
          visible={activityModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setActivityModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setActivityModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    ...styles.modalContainer,
                  }}
                >
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={() => setActivityModalVisible(false)}
                    >
                      <Ionicons name="close" size={15} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Activity Detail</Text>
                  </View>
                  <ScrollView
                    contentContainerStyle={{
                      ...styles.scrollViewContent,
                    }}
                  >
                    {/* <TouchableOpacity
                      onPress={() => setShowImageViewer(true)}
                    ></TouchableOpacity> */}
                    <DetailCarousel data={selectedActivity} />
                    {/* <View style={styles.imageNavigationContainer}>
                      <TouchableOpacity
                        onPress={handlePrevImage}
                        style={{
                          ...styles.navButton,
                          position: "absolute",
                          top: 0,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.navButtonText,
                            transform: [{ rotate: "90deg" }],
                          }}
                        >
                          ▼
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleNextImage}
                        style={{
                          ...styles.navButton,
                          position: "absolute",
                          end: 0,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.navButtonText,
                            transform: [{ rotate: "-90deg" }],
                          }}
                        >
                          ▼
                        </Text>
                      </TouchableOpacity>
                    </View> */}
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.selectedActivityTitle}>
                        {selectedActivity.name}
                      </Text>
                      <View>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginVertical: 5,
                            gap: 10,
                          }}
                          onPress={() => {
                            setSelectedActivity(null);
                            navigate.push("Map", {
                              name: selectedActivity.name,
                              location: selectedActivity.location,
                              coords: selectedActivity.coords,
                            });
                          }}
                        >
                          <Text style={{ color: "gray" }}>
                            {selectedActivity.location}
                          </Text>
                          <EvilIcons name="location" size={22} color="black" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.selectedActivityDescription}>
                        {selectedActivity.description || "No Description"}
                      </Text>
                      <Text style={styles.selectedActivityRating}>Rating:</Text>
                      <View style={{ alignItems: "center", right: 55 }}>
                        <ActivityStar rating={selectedActivity.rating} />
                      </View>
                      <Text style={styles.modalLabel}>Price:</Text>
                      <Text style={styles.activityPrice}>
                        {selectedActivity.price}
                      </Text>
                      <TouchableOpacity
                        style={styles.addToTimelineButton}
                        onPress={handleAddToTimeline}
                      >
                        <Text style={styles.addToTimelineButtonText}>
                          Add to Timeline
                        </Text>
                      </TouchableOpacity>
                      {/* !! admin only */}
                      {role === "admin" && (
                        <TouchableOpacity
                          style={{
                            ...styles.addToTimelineButton,
                            backgroundColor: "red",
                          }}
                          onPress={() => handleDelete(selectedActivity.id)}
                        >
                          <Text style={styles.addToTimelineButtonText}>
                            Delete Activity
                          </Text>
                        </TouchableOpacity>
                      )}
                      {/*  !! admin only */}
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

          {/* Image Viewer Modal */}
          {showImageViewer && (
            <Modal
              visible={showImageViewer}
              transparent={true}
              onRequestClose={() => setShowImageViewer(false)}
            >
              <View style={styles.imageViewerContainer}>
                <ImageViewer
                  imageUrls={selectedActivity.imgUrls.map((url) => ({ url }))}
                  enableImageZoom={true}
                  enableSwipeDown={true}
                  onSwipeDown={() => setShowImageViewer(false)}
                />
              </View>
            </Modal>
          )}
        </Modal>
      )}
      {/* AI Modal */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          style={{ ...styles.modalContainer }}
        >
          <TouchableOpacity
            style={{ ...styles.modalOverlay }}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View style={{ ...styles.modalContainer }}>
              <ImageBackground
                source={{
                  uri: "https://5.imimg.com/data5/SELLER/Default/2023/7/322745470/DM/IE/MR/127740382/whatsapp-image-2023-07-05-at-6-40-02-pm.jpeg",
                }}
                style={{ ...styles.backgroundImage, borderRadius: 15 }}
                onStartShouldSetResponder={() => true}
              >
                <View style={styles.headerContainer}>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={15} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.headerText}>Ask Something?</Text>
                </View>
                <FlatList
                  data={aiMessages}
                  renderItem={({ item }) => (
                    <TouchableOpacity>
                      <View
                        style={
                          item.type === "ai"
                            ? styles.aiMessage
                            : styles.userMessage
                        }
                      >
                        <Text style={styles.messageText}>{item.text}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.messagesList}
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                  }}
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={userMessage}
                    onChangeText={setUserMessage}
                    placeholder="Type your message"
                    placeholderTextColor="#888"
                  />
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={styles.sendButton}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="github-alt" size={24} color="black" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    left: "45%",
    transform: [{ translateX: -50 }],
  },
  errorText: {
    fontSize: 18,
    color: "red",
    lign: "center",
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
  },
  card: {
    margin: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardDetails: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardRating: {
    fontSize: 16,
    color: "#888",
  },
  cardLocation: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    height: "80%",
    maxHeight: "80%",
    borderRadius: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
  },
  selectedActivityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imageNavigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    position: "absolute",
    top: 75,
    left: 10,
    width: "100%",
  },
  navButton: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  navButtonText: {
    color: "black",
    fontSize: 34,
  },
  selectedActivityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedActivityDescription: {
    fontSize: 16,
    margin: 10,
    textAlign: "justify",
    lineHeight: 20,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginVertical: 5,
    color: "#888",
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  activityPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
  addToTimelineButton: {
    backgroundColor: "#7ec8e3",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  addToTimelineButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#f00",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    justifyContent: "center",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  aiMessage: {
    backgroundColor: "#e1ffc7",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "75%",
    marginLeft: 10,
  },
  userMessage: {
    backgroundColor: "#d3f1ff",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    alignSelf: "flex-end",
    backgroundColor: "#d3f1ff",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    maxWidth: "75%",
    marginLeft: "auto",
    marginRight: 10,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e1ffc7",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    maxWidth: "75%",
    marginLeft: 10,
  },
  userMessageText: {
    color: "#000",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#7ec8e3",
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 8,
    left: 10,
    backgroundColor: "#FFC436",
    borderRadius: 50,
    padding: 9,
  },
});

export default HomeScreen;
