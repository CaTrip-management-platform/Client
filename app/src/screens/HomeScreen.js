import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
const popularPlaces = [
  {
    id: '1',
    name: 'Pantai Kuta',
    rating: '4.5',
    location: 'Bali, Indonesia',
    price: 'RP.200,000,-',
    image: 'https://lh7-us.googleusercontent.com/9vEhEHIfICi9YXdWt9gZiSlzIoKe0R-jZwc546RiLoBFf_8icGzSAC9UvIQCLSkqG2AOqmvHmZ13S795sqmRniTBrqIg_eVDKMsow-eicg0JXot4kHmr0xq4YFuR6fSslXX5ZAMvOfVuuYcRkZbAwFI',
  },
  {
    id: '2',
    name: 'Hotel Borobudur',
    rating: '4.7',
    location: 'Jakarta, Indonesia',
    price: 'RP.350,000,-',
    image: 'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/10000082-5e1fd5c643b68b0439323df2f2b5bd05.jpeg?tr=q-40,c-at_max,w-740,h-500&_src=imagekit',
  },
  {
    id: '3',
    name: 'Gunung Bromo',
    rating: '4.9',
    location: 'Malang, Indonesia',
    price: 'RP.550,000',
    image: 'https://ik.imagekit.io/tvlk/blog/2022/09/Wisata-Gunung-Bromo-Traveloka-Xperience-1.jpg?tr=dpr-2,w-675',
  },
];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Pantai');


  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Recommendations Section */}
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
      {/* Popular Places Section */}
      <Text style={styles.sectionTitle}>Populer</Text>
    </View>
  );

  return (
    <FlatList
      data={popularPlaces}
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
});

export default HomeScreen;
