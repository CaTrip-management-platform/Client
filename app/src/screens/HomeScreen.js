import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, Button, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@apollo/client';
import { GET_Activity } from '../queries/getAllActivity';
import { ActivityIndicator } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Pantai');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { loading, error, data } = useQuery(GET_Activity);

  if (loading) return (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (error) return <Text>Error: {error.message}</Text>;

  const formatPrice = (price) => `Rp.${price.toLocaleString()}`;

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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.showModalButton}>
          <Text style={styles.aiButton}>AI</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recommendationsContainer}>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Pantai" value="Pantai" />
          <Picker.Item label="Urban" value="Urban" />
          <Picker.Item label="Mountain" value="Mountain" />
        </Picker>
      </View>
      <Text style={styles.sectionTitle}>Populer</Text>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg" }}
      style={styles.container}
    >
      <View style={styles.container}>
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedActivity(item);
                setModalVisible(true);
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
          contentContainerStyle={styles.container}
        />
        {selectedActivity && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: selectedActivity.image }}
                  style={styles.selectedActivityImage}
                />
                <Text style={styles.selectedActivityTitle}>{selectedActivity.name}</Text>
                <Text style={styles.selectedActivityDescription}>{selectedActivity.description || 'No Description'}</Text>
                <Text>Type :</Text>
                {selectedActivity.types?.map((type, index) => (
                  <Text key={index}>{type.name} - {formatPrice(type.price)}</Text>
                ))}
                <Text style={styles.selectedActivityRating}>Rating: {selectedActivity.rating}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 20,
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
  showModalButton: {
    borderRadius: 9,
    width: 40,
    backgroundColor: '#5B99C2',
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
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
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  },
  selectedActivityImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  selectedActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  aiButton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default HomeScreen;
