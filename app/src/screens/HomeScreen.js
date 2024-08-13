import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({ searchResults, navigation }) => {
  const navigate = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_Activity);

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

  useEffect(() => {
    // Check if this is the first visit
    const checkFirstVisit = async () => {
      try {
        const firstVisit = await SecureStore.getItemAsync("firstVisit");
        if (!firstVisit) {
          setModalVisible(true);
          await SecureStore.setItemAsync("firstVisit", "true");
        }
      } catch (error) {
        console.error("Error checking first visit:", error);
      }
    };

    checkFirstVisit();
  }, []);

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

  const formatPrice = (price) => `Rp.${price.toLocaleString("id-ID")},-`;

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
                <View style={{ ...styles.modalContainer, borderRadius: 15 }}>
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={() => setActivityModalVisible(false)}
                    >
                      <Ionicons name="close" size={15} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Activity Detail</Text>
                  </View>
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
                        style={{
                          ...styles.navButton,
                          position: "absolute",
                          top: 0,
                        }}
                      >
                        <Text style={styles.navButtonText}>&lt;</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleNextImage}
                        style={{
                          ...styles.navButton,
                          position: "absolute",
                          top: 0,
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
              <TouchableWithoutFeedback
                onPress={() => setShowImageViewer(false)}
              >
                <View style={styles.imageViewerOverlay}>
                  <ImageViewer
                    imageUrls={selectedActivity.imgUrls.map((url) => ({
                      url,
                    }))}
                    index={currentImageIndex}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </Modal>
      )}

      {/* User Message Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Welcome!</Text>
              <Text style={styles.modalMessage}>
                We are here to assist you. Ask us anything about your travel
                plans.
              </Text>
              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Type your message"
                  value={userMessage}
                  onChangeText={(text) => setUserMessage(text)}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.messagesContainer}>
                {aiMessages.map((message, index) => (
                  <View
                    key={index}
                    style={{
                      ...styles.messageBubble,
                      backgroundColor:
                        message.type === "user" ? "#e1f5fe" : "#f1f1f1",
                      alignSelf: message.type === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Text style={styles.messageText}>{message.text}</Text>
                  </View>
                ))}
              </ScrollView>
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
    resizeMode: "cover",
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
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
    fontSize: 14,
    color: "gray",
  },
  cardLocation: {
    fontSize: 14,
    color: "gray",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedActivityImage: {
    width: "100%",
    height: 200,
  },
  imageNavigationContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  selectedActivityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  activityPrice: {
    fontSize: 16,
    color: "green",
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: "black",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  modalInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messagesContainer: {
    maxHeight: 200,
    marginTop: 10,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
});

export default HomeScreen;
