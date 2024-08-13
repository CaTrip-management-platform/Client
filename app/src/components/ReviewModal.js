import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReviewModal = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    onSubmit({ rating, review });
    onClose();
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Leave a Review</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
              <Icon
                name={star <= rating ? 'star' : 'star-border'}
                size={40}
                color={star <= rating ? '#FFD700' : '#CCCCCC'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Share your experience..."
          value={review}
          onChangeText={setReview}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewModal;