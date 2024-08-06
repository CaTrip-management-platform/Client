import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/client';
import { ADD_Activity } from '../queries/activity.js';

const AddActivityScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [types, setTypes] = useState([{ name: '', price: '' }]);
  const [imgurls, setImgurls] = useState(['']);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['']);
  const [reviews, setReviews] = useState([{ content: '', imageUrl: '', rating: '' }]);
  const [location, setLocation] = useState('');

  const [addActivity] = useMutation(ADD_Activity);

  const handleAddType = () => setTypes([...types, { name: '', price: '' }]);
  const handleRemoveType = (index) => setTypes(types.filter((_, i) => i !== index));

  const handleTypeChange = (index, field, value) => {
    const newTypes = [...types];
    newTypes[index][field] = value;
    setTypes(newTypes);
  };

  const handleAddImageUrl = () => setImgurls([...imgurls, '']);
  const handleRemoveImageUrl = (index) => setImgurls(imgurls.filter((_, i) => i !== index));

  const handleImageUrlChange = (index, value) => {
    const newImgurls = [...imgurls];
    newImgurls[index] = value;
    setImgurls(newImgurls);
  };

  const handleAddTag = () => setTags([...tags, '']);
  const handleRemoveTag = (index) => setTags(tags.filter((_, i) => i !== index));

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddReview = () => setReviews([...reviews, { content: '', imageUrl: '', rating: '' }]);
  const handleRemoveReview = (index) => setReviews(reviews.filter((_, i) => i !== index));

  const handleReviewChange = (index, field, value) => {
    const newReviews = [...reviews];
    newReviews[index][field] = value;
    setReviews(newReviews);
  };

  const handleAddActivity = async () => {
    try {
      const parsedTypes = types.map(type => ({
        name: type.name,
        price: parseInt(type.price, 10) || 0,
      }));
      const parsedReviews = reviews.map(review => ({
        content: review.content,
        imageUrl: review.imageUrl,
        rating: parseInt(review.rating, 10) || 0,
      }));
      
      await addActivity({
        variables: {
          title,
          types: parsedTypes,
          imgurls,
          description,
          tags,
          reviews: parsedReviews,
          location,
        },
      });
      Alert.alert('Success', 'Activity added successfully!');
      navigation.goBack();
    } catch (error) {
      console.log(error,`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Activity</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Activity Name</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Hiking Adventure"
        />
      </View>
      
      {types.map((type, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>Type Name</Text>
          <TextInput
            style={styles.input}
            value={type.name}
            onChangeText={(value) => handleTypeChange(index, 'name', value)}
            placeholder="Premium"
          />
          <Text style={styles.label}>Type Price</Text>
          <TextInput
            style={styles.input}
            value={type.price}
            onChangeText={(value) => handleTypeChange(index, 'price', value)}
            placeholder="500000"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleRemoveType(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove Type</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Type" onPress={handleAddType} color="#007BFF" />

      {imgurls.map((url, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>Image URL {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={(value) => handleImageUrlChange(index, value)}
            placeholder="https://example.com/image.jpg"
          />
          <TouchableOpacity onPress={() => handleRemoveImageUrl(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Image URL" onPress={handleAddImageUrl} color="#007BFF" />

      {tags.map((tag, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>Tag {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={tag}
            onChangeText={(value) => handleTagChange(index, value)}
            placeholder="Adventure"
          />
          <TouchableOpacity onPress={() => handleRemoveTag(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove Tag</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Tag" onPress={handleAddTag} color="#007BFF" />

      {reviews.map((review, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>Review Content</Text>
          <TextInput
            style={styles.input}
            value={review.content}
            onChangeText={(value) => handleReviewChange(index, 'content', value)}
            placeholder="Great place!"
          />
          <Text style={styles.label}>Review Image URL</Text>
          <TextInput
            style={styles.input}
            value={review.imageUrl}
            onChangeText={(value) => handleReviewChange(index, 'imageUrl', value)}
            placeholder="https://example.com/review.jpg"
          />
          <Text style={styles.label}>Review Rating</Text>
          <TextInput
            style={styles.input}
            value={review.rating}
            onChangeText={(value) => handleReviewChange(index, 'rating', value)}
            placeholder="5"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleRemoveReview(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove Review</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Review" onPress={handleAddReview} color="#007BFF" />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="A thrilling adventure..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Yosemite National Park"
        />
      </View>
<View style={styles.buttonAdd}>
      <Button  title="Add Activity" onPress={handleAddActivity} color="#28A745" />

</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  removeButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#DC3545',
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonAdd:{
    marginBottom: 20
  }
});

export default AddActivityScreen;
