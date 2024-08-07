import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ImageBackground, TextInput } from 'react-native';
import { useQuery, useApolloClient, gql } from '@apollo/client';
import { GET_Activity } from '../queries/getAllActivity';
import { ActivityIndicator } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';


const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

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
      setAiMessages([...aiMessages, { type: 'user', text: userMessage }, { type: 'ai', text: data.getTravelSupport.message }]);
      setUserMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const formatPrice = (price) => `Rp.${price.toLocaleString('id-ID')}`;

  const getPriceRange = (prices) => {
    if (!prices || prices.length === 0) return 'N/A';
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const activities = data.getAllActivity.map(activity => {
    const prices = (activity.types && activity.types.map(type => type.price)) || [];
    return {
      id: activity._id,
      name: activity.title,
      rating: (activity.reviews && activity.reviews.length > 0) ? activity.reviews[0].rating : 'N/A',
      location: activity.location || 'Unknown Location',
      price: getPriceRange(prices),
      image: (activity.imgUrls && activity.imgUrls.length > 0) ? activity.imgUrls[0] : 'https://via.placeholder.com/150',
      description: activity.description,
      types: activity.types,
    };
  });

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.sectionTitle}>Rekomendasi Tempat</Text>
      </View>
      <Text style={styles.sectionTitle}>Populer</Text>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg" }}
      style={styles.backgroundImage}
    >
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedActivity(item);
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
              <Image
                source={{ uri: selectedActivity.image }}
                style={styles.selectedActivityImage}
              />
              <Text style={styles.selectedActivityTitle}>{selectedActivity.name}</Text>
              <Text style={styles.selectedActivityDescription}>{selectedActivity.description || 'No Description'}</Text>
              <Text style={styles.modalLabel}>Type :</Text>
              {selectedActivity.types?.map((type, index) => (
                <Text key={index}>{type.name} - {formatPrice(type.price)}</Text>
              ))}
              <Text style={styles.selectedActivityRating}>Rating: {selectedActivity.rating}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setActivityModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
            <View style={styles.modalContent}>
              <View style={styles.chatContainer}>
                <FlatList
                  data={aiMessages}
                  renderItem={({ item }) => (
                    <View style={item.type === 'ai' ? styles.aiMessage : styles.userMessage}>
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
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}><Ionicons name="logo-octocat" size={30} color="black" /></Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardDetails: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardRating: {
    color: '#888',
  },
  cardLocation: {
    color: '#888',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: '80%',
    justifyContent: 'space-between',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  messagesList: {
    flex: 1,
  },
  aiMessage: {
    backgroundColor: '#e1e1e1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#E4003A',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedActivityImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  selectedActivityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectedActivityDescription: {
    fontSize: 14,
    marginVertical: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeScreen;
