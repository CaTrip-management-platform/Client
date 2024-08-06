import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@apollo/client';
import { GET_Activity } from '../queries/getAllActivity.js';
import { ActivityIndicator } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Pantai');
  
  const { loading, error, data } = useQuery(GET_Activity);

  if (loading) return (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (error) return <Text>Error: {error.message}</Text>;

  const formatPrice = (price) => {
    return `Rp.${price.toLocaleString()}`;
  };

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
    };
  });

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Rekomendasi Tempat</Text>
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
    <FlatList
      data={activities}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DetailsScreen', { item })}
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
  recommendationsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

export default HomeScreen;
