import React, { useState } from "react";
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
      {/* AI Modal */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
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
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
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
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
  },
  card: {
    margin: 10,
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
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerContainer: {
    padding: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  listContent: {
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    height: "80%",
  },
  scrollViewContent: {
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
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  selectedActivityTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  selectedActivityRating: {
    fontSize: 16,
    color: "#888",
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  activityPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    alignItems: "center",
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
    padding: 10,
  },
  messagesList: {
    flex: 1,
  },
  aiMessage: {
    backgroundColor: "#e1ffc7",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  userMessage: {
    backgroundColor: "#d3f1ff",
    borderRadius: 20,
    padding: 8,
    marginVertical: 4,
    alignSelf: "flex-end",
    maxWidth: "75%",
    marginLeft: "auto",
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
    borderRadius: 20,
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
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 50,
    padding: 10,
  },
});

export default HomeScreen;
