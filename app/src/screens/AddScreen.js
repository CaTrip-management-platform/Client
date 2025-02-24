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
import { GOOGLE_MAPS_API_KEY } from "@env";

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

  const [addActivity, { data, error, loading }] = useMutation(ADD_ACTIVITY);

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

  const moveToLocation = async (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      2000
    );
  };
  const removeMarker = () => {
    setMarkerPresent(false);
    setCoords({ latitude: null, longitude: null });
    setLocation("");
  };
  // map

  const handleSubmit = async () => {
    try {
      console.log(
        title,
        description,
        tags,
        price,
        location,
        imgUrls,
        coords.latitude
      );
      const result = await addActivity({
        variables: {
          title,
          price: +price,
          description,
          imgUrls,
          tags,
          location,
          coords: {
            latitude: coords.latitude.toString(),
            longitude: coords.longitude.toString(),
          },
        },
      });
      console.log(result);
      Alert.alert("Success", "Activity added successfully");
      navigation.replace("MainTab");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Activity Title"
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        placeholder="Activity Price"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Activity Description"
      />
      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Activity Location"
      />
      <Text style={styles.label}>Image URLs:</Text>
      {imgUrls.map((url, index) => (
        <View key={index} style={styles.urlContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{
                ...styles.input,
                width: "80%",
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
              }}
              value={url}
              onChangeText={(text) => {
                const newUrls = [...imgUrls];
                newUrls[index] = text;
                setImgUrls(newUrls);
              }}
              placeholder={`Image URL ${index + 1}`}
            />
            <TouchableOpacity
              style={{}}
              onPress={() => handleRemoveImageUrl(index)}
            >
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddImageUrl}>
        <Text style={{ color: "white" }}>Add Another Image URL</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Tags:</Text>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tagContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{
                ...styles.input,
                width: "80%",
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
              }}
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
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
        <Text style={{ color: "white" }}>Add Another Tag</Text>
      </TouchableOpacity>
      <View>
        <View
          style={{ position: "absolute", width: "100%", zIndex: 1, top: 29 }}
        >
          <GooglePlacesAutocomplete
            placeholder="Search for a location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const { lat, lng } = details?.geometry?.location;
              moveToLocation(lat, lng);
              updateLocation(latitude, longitude);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            onFail={(error) => console.error(error)}
            styles={{
              textInput: { ...styles.mapInput, marginBottom: 0 },
            }}
          />
        </View>
        <Text style={styles.label}>Add location on map:</Text>
        <View style={styles.mapContainer}>
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
        </View>
        {markerPresent && (
          <TouchableOpacity
            onPress={removeMarker}
            style={{
              ...styles.removeMarkerButton,
              position: "absolute",
              end: 0,
              bottom: 30,
              right: 10,
            }}
          >
            <Text style={styles.removeMarkerButtonText}>Remove Marker</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#7ec8e3",
          borderRadius: 25,
          paddingVertical: 12,
          alignItems: "center",
          marginVertical: 10,
          marginBottom: 20,
        }}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {loading ? "Loading..." : "Create New Activity"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#f9f9f9",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
    fontSize: 16,
  },
  mapInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    fontSize: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  urlContainer: {
    marginBottom: 8,
  },
  tagContainer: {
    marginBottom: 8,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#7ec8e3",
    padding: 8,
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
  removeButton: {
    color: "white",
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignSelf: "center",
    bottom: 6,
  },
  mapContainer: {
    width: "100%",
    height: 300,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "gray",
    borderWidth: 1,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 16,
    zIndex: 0,
    borderRadius: 10,
    overflow: "hidden",
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
    fontSize: 12,
  },
});

export default AddActivityScreen;
