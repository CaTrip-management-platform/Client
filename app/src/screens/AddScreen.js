import React, { useState } from "react";
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

const AddActivityScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imgUrls, setImgUrls] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [addActivity] = useMutation(ADD_ACTIVITY, {
    refetchQueries: [
      { query: GET_ACTIVITY },
    ],
    awaitRefetchQueries: true, 
  });

  const handleAddImageUrl = () => setImgUrls([...imgUrls, ""]);
  const handleRemoveImageUrl = (index) => setImgUrls(imgUrls.filter((_, i) => i !== index));
  const handleAddTag = () => setTags([...tags, ""]);
  const handleRemoveTag = (index) => setTags(tags.filter((_, i) => i !== index));

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
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
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
});

export default AddActivityScreen;
