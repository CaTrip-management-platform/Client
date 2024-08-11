import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_ACTIVITY } from "../queries/addActivityAdmin";
import { GET_ACTIVITY } from "../queries/getAllActivity";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const AddActivityScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imgUrls, setImgUrls] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [coords, setCoords] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerPresent, setMarkerPresent] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && coords.latitude && coords.longitude) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  }, [coords]);

  const [addActivity] = useMutation(ADD_ACTIVITY, {
    refetchQueries: [{ query: GET_ACTIVITY }],
    awaitRefetchQueries: true,
  });

  const handleAddImageUrl = () => setImgUrls([...imgUrls, ""]);
  const handleRemoveImageUrl = (index) =>
    setImgUrls(imgUrls.filter((_, i) => i !== index));
  const handleAddTag = () => setTags([...tags, ""]);
  const handleRemoveTag = (index) =>
    setTags(tags.filter((_, i) => i !== index));

  // map
  const updateLocation = (lat, lng) => {
    const newCoords = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    };
    setCoords(newCoords);
    setMapRegion({
      ...newCoords,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkerPresent(true);
  };
  const removeMarker = () => {
    setMarkerPresent(false);
    setCoords({ latitude: null, longitude: null });
    setLocation("");
    setMapRegion({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  // map

  const handleSubmit = async () => {
    try {
      await addActivity({
        variables: {
          title,
          description,
          tags,
          price: parseFloat(price),
          location,
          imgUrls,
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
        },
      });
      Alert.alert("Success", "Activity added successfully");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
      <Text style={styles.label}>Image URLs:</Text>
      {imgUrls.map((url, index) => (
        <View key={index} style={styles.urlContainer}>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={(text) => {
              const newUrls = [...imgUrls];
              newUrls[index] = text;
              setImgUrls(newUrls);
            }}
            placeholder={`Image URL ${index + 1}`}
          />
          <TouchableOpacity onPress={() => handleRemoveImageUrl(index)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddImageUrl}>
        <Text style={styles.addButton}>Add Another Image URL</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Tags:</Text>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tagContainer}>
          <TextInput
            style={styles.input}
            value={tag}
            onChangeText={(text) => {
              const newTags = [...tags];
              newTags[index] = text;
              setTags(newTags);
            }}
            placeholder={`Tag ${index + 1}`}
          />
          <TouchableOpacity onPress={() => handleRemoveTag(index)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddTag}>
        <Text style={styles.addButton}>Add Another Tag</Text>
      </TouchableOpacity>
      <View>
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          fetchDetails
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            updateLocation(lat, lng);
            setLocation(data.description);
          }}
          query={{
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: "en",
          }}
          styles={{
            textInput: styles.input,
          }}
        />
        <Text style={styles.label}>Map:</Text>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            updateLocation(latitude, longitude);
          }}
        >
          {markerPresent && coords.latitude && coords.longitude && (
            <Marker coordinate={coords} />
          )}
        </MapView>
        {markerPresent && (
          <TouchableOpacity
            onPress={removeMarker}
            style={styles.removeMarkerButton}
          >
            <Text style={styles.removeMarkerButtonText}>Remove Marker</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addButton: {
    color: "blue",
    marginBottom: 16,
  },
  removeButton: {
    color: "red",
    marginLeft: 8,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  removeMarkerButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
  },
  removeMarkerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddActivityScreen;
