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
} from "react-native";
import { useQuery, useApolloClient, gql } from "@apollo/client";
import { GET_Activity } from "../queries/getAllActivity";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

import ImageViewer from 'react-native-image-zoom-viewer';




const HomeScreen = ({ searchResults }) => {
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
      setAiMessages([
        ...aiMessages,
        { type: "user", text: userMessage },
        { type: "ai", text: data.getTravelSupport.message },
      ]);
      setUserMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'Invalid price';
    }
    return `Rp ${price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace('IDR', '')}`;
  };


  const activities = searchResults.length > 0 ? searchResults.map(activity => ({
    id: activity._id,
    name: activity.title,
    rating: (activity.reviews && activity.reviews.length > 0) ? activity.reviews[0].rating : 'N/A',
    location: activity.location || 'Unknown Location',
    price: formatPrice(activity.price),
    image: (activity.imgUrls && activity.imgUrls.length > 0) ? activity.imgUrls[0] : 'https://via.placeholder.com/150',
    description: activity.description,
    types: activity.types,
    imgUrls: activity.imgUrls || [],
  })) : data.getAllActivity.map(activity => {
    const prices = (activity.types && activity.types.map(type => type.price)) || [];
    return {
      id: activity._id,
      name: activity.title,
      rating: (activity.reviews && activity.reviews.length > 0) ? activity.reviews[0].rating : 'N/A',
      location: activity.location || 'Unknown Location',
      price: formatPrice(activity.price),
      image: (activity.imgUrls && activity.imgUrls.length > 0) ? activity.imgUrls[0] : 'https://via.placeholder.com/150',
      description: activity.description,
      types: activity.types,
      imgUrls: activity.imgUrls || [],
    };
  });


  // >>>>>>> e3b79304eb97485185eda9a347a6a0d420297d46

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
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* <<<<<<< HEAD */}
                {/* <Image
                  source={{ uri: selectedActivity.image }}
                  style={styles.selectedActivityImage}
                />
                <Text style={styles.selectedActivityTitle}>
                  {selectedActivity.name}
                </Text>
                <Text style={styles.selectedActivityDescription}>
                  {selectedActivity.description || "No Description"}
                </Text>
                <Text style={styles.selectedActivityRating}>
                  Rating: {selectedActivity.rating}
                </Text>
                <Text style={styles.modalLabel}>Price:</Text>
                <Text style={styles.activityPrice}>
                  {selectedActivity.price}
                </Text> */}
                {/* ======= */}
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
                    style={styles.navButton}
                  >
                    <Text style={styles.navButtonText}>&gt;</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.selectedActivityTitle}>
                  {selectedActivity.name}
                </Text>
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
                {/* >>>>>>> e3b79304eb97485185eda9a347a6a0d420297d46 */}
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
          </View>

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
          <View style={styles.modalContainer}>
            {/* <<<<<<< HEAD
            <View style={styles.modalContent}>
              <View style={styles.chatContainer}>
                <FlatList
                  data={aiMessages}
                  renderItem={({ item }) => (
                    <View
                      style={
                        item.type === "ai"
                          ? styles.aiMessage
                          : styles.userMessage
                      }
                    >
                      <Text>{item.text}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.messagesList}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={userMessage}
                  onChangeText={setUserMessage}
                  placeholder="Type your message"
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
======= */}
            <View style={styles.chatContainer}>
              <FlatList
                data={aiMessages}
                renderItem={({ item }) => (
                  <View
                    style={
                      item.type === "ai" ? styles.aiMessage : styles.userMessage
                    }
                  >
                    <Text>{item.text}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messagesList}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={userMessage}
                onChangeText={setUserMessage}
                placeholder="Type your message"
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              {/* >>>>>>> e3b79304eb97485185eda9a347a6a0d420297d46 */}
            </View>
          </View>
        </Modal>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>
          <Ionicons name="logo-octocat" size={30} color="black" />
        </Text>
      </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  // =======
  card: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 2,
    // >>>>>>> e3b79304eb97485185eda9a347a6a0d420297d46
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
    color: "#888",
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
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 20,
    alignItems: "center",
    height: "80%",
    justifyContent: "space-between",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  scrollViewContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  selectedActivityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  aiMessage: {
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: "flex-end",
  },

  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
  },

  imageNavigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
  },

  navButtonText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedActivityTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  activityType: {
    fontSize: 16,
    marginVertical: 5,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#E4003A",
    alignSelf: "center",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
  },
  aiMessage: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: "flex-end",
    color: "white",
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
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    // <<<<<<< HEAD
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedActivityImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  selectedActivityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  selectedActivityDescription: {
    fontSize: 14,
    marginVertical: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    // =======
  },
  floatingButtonText: {
    fontSize: 24,
  },

  activityPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default HomeScreen;
