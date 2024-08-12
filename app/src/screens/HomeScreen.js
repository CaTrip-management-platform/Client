import React, { useCallback, useState } from "react";
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
import { useQuery, useApolloClient, gql } from "@apollo/client";
import { GET_Activity } from "../queries/getAllActivity";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ searchResults, navigation }) => {
  const navigate = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [timelineData, setTimelineData] = useState([]);

  const client = useApolloClient();
  const { loading, error, data, refetch } = useQuery(GET_Activity);

  // console.log(data);

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

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  const formatPrice = (price) => `Rp.${price.toLocaleString()},-`;

  const activities =
    searchResults.length > 0
      ? searchResults.map((activity) => ({
          id: activity._id,
          name: activity.title,
          rating:
            activity.reviews && activity.reviews.length > 0
              ? activity.reviews[0].rating
              : "N/A",
          location: activity.location || "Unknown Location",
          price: formatPrice(activity.price),
          image:
            activity.imgUrls && activity.imgUrls.length > 0
              ? activity.imgUrls[0]
              : "https://via.placeholder.com/150",
          description: activity.description,
          coords: activity.coords,
        }))
      : data.getAllActivity.map((activity) => ({
          id: activity._id,
          name: activity.title,
          rating:
            activity.reviews && activity.reviews.length > 0
              ? activity.reviews[0].rating
              : "N/A",
          location: activity.location || "Unknown Location",
          price: formatPrice(activity.price),
          image:
            activity.imgUrls && activity.imgUrls.length > 0
              ? activity.imgUrls[0]
              : "https://via.placeholder.com/150",
          description: activity.description,
          types: activity.types,
          imgUrls: activity.imgUrls || [],
          coords: activity.coords,
        }));

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.sectionTitle}>Rekomendasi Tempat</Text>
      </View>
      <Text style={styles.sectionTitle}>Populer</Text>
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

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleAddToTimeline = async () => {
    setTimelineData((timelineData) => {
      const data = [...timelineData, selectedActivity];
      return data;
    });

    try {
      console.log(timelineData);

      const timelineDataString = JSON.stringify(timelineData);
      await saveData("timelineData", timelineDataString);
      alert("Added to Timeline");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
      }}
      style={styles.backgroundImage}
    >
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
              <Text style={styles.cardRating}>Rating: {item.rating}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
      />

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
                <View style={styles.modalContainer}>
                  <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity onPress={() => setShowImageViewer(true)}>
                      <Image
                        source={{
                          uri: selectedActivity.imgUrls[currentImageIndex],
                        }}
                        style={styles.selectedActivityImage}
                      />
                    </TouchableOpacity>
                    <View style={styles.imageNavigationContainer}>
                      <TouchableOpacity
                        onPress={handlePrevImage}
                        style={styles.navButton}
                      >
                        <Text style={styles.navButtonText}>&lt;</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleNextImage}
                        style={{
                          ...styles.navButton,
                          position: "absolute",
                          end: 0,
                        }}
                      >
                        <Text style={styles.navButtonText}>&gt;</Text>
                      </TouchableOpacity>
                    </View>
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
                      <Text style={styles.selectedActivityRating}>
                        Rating: {selectedActivity.rating}
                      </Text>
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
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setActivityModalVisible(false)}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
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

      {/* Chat Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.chatModalContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Chat with AI</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.chatContent}>
              <ScrollView
                style={styles.chatScroll}
                contentContainerStyle={styles.chatScrollContent}
              >
                {aiMessages.map((message, index) => (
                  <View
                    key={index}
                    style={
                      message.type === "user"
                        ? styles.userMessage
                        : styles.aiMessage
                    }
                  >
                    <Text
                      style={
                        message.type === "user"
                          ? styles.userMessageText
                          : styles.aiMessageText
                      }
                    >
                      {message.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.chatFooter}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message"
                value={userMessage}
                onChangeText={setUserMessage}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <FontAwesome5 name="paper-plane" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
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
    color: "gray",
  },
  cardLocation: {
    color: "gray",
  },
  cardPrice: {
    fontSize: 16,
    color: "green",
  },
  listContent: {
    paddingHorizontal: 10,
  },
  headerContainer: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerContent: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  selectedActivityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imageNavigationContainer: {
    marginTop: 10,
    position: "relative",
  },
  navButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    padding: 10,
    paddingVertical: 86,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -210 }],
  },
  navButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  selectedActivityTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  activityPrice: {
    fontSize: 18,
    color: "green",
  },
  addToTimelineButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  addToTimelineButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#f44336",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: "center",
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
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingVertical: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e1ffc7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessageText: {
    color: "#000",
  },
  aiMessageText: {
    color: "#000",
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageViewerContainer: {
    flex: 1,
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

    backgroundColor: "#FFC436",
    borderRadius: 50,
    padding: 9,

    left: 10,
  },
  // modalContainer: {
  //     borderRadius: 30,
  // },
  sendButton: {
    marginLeft: 10,
  },
});

export default HomeScreen;
