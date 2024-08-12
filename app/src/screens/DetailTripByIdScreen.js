import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Modal } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRIP_BY_ID } from '../queries/getTripById';
import { GET_ACTIVITY_BY_ID } from '../queries/getActivityById';
import { UPDATE_DATE } from '../queries/updateDateTrip';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';

function TripDetailScreen({ route }) {
  const { tripId } = route.params;

  const { loading: tripLoading, error: tripError, data: tripData, refetch } = useQuery(GET_TRIP_BY_ID, {
    variables: { tripId, caches: 'no-cache' },
  });

  const activityIds = tripData?.getTripById.activities.map(activity => activity.activityId) || [];

  const { loading: activityLoading, error: activityError, data: activityData } = useQuery(GET_ACTIVITY_BY_ID, {
    variables: { id: activityIds[0] },
    skip: activityIds.length === 0,
  });

  const [updateDate] = useMutation(UPDATE_DATE);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);

  const handleDateSelect = (date) => {
    if (showStartDateModal) {
      setNewStartDate(date.dateString);
    } else if (showEndDateModal) {
      setNewEndDate(date.dateString);
    }
  };

  const handleUpdateDate = async () => {
    setIsUpdating(true);
    setUpdateSuccess(null);
    setUpdateError(null);

    try {
      const response = await updateDate({
        variables: {
          dateInput: {
            startDate: newStartDate,
            endDate: newEndDate,
          },
          tripId,
        },
      });

      if (response.data) {
        setUpdateSuccess('Dates updated successfully!');
        setNewStartDate('');
        setNewEndDate('');
        await refetch();
      } else {
        setUpdateError('No response data received.');
      }
    } catch (error) {
      setUpdateError('Failed to update dates. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (tripLoading || activityLoading) {
    return <ActivityIndicator size="large" color="#6C5B7B" style={styles.loader} />;
  }

  if (tripError || activityError) {
    return <Text style={styles.errorText}>Error! {tripError?.message || activityError?.message}</Text>;
  }

  const trip = tripData?.getTripById;

  if (!trip) {
    return <Text style={styles.errorText}>Trip not found</Text>;
  }

  return (
    <LinearGradient
      colors={['#a8c0ff', '#3f2b96']} 
      style={StyleSheet.absoluteFillObject} 
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{trip.destination || 'Destination not available'}</Text>
          <Text style={styles.details}>Start Date: {newStartDate || trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Not available'}</Text>
          <Text style={styles.details}>End Date: {newEndDate || trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'Not available'}</Text>
          <Text style={styles.details}>Total Price: {trip.totalPrice ?? 'Not available'}</Text>
          <Text style={styles.details}>Payment Status: {trip.paymentStatus || 'Not available'}</Text>

          {trip.paymentStatus === 'Pending' && (
            <>
              <View style={styles.buttonContainer}>
                <Button 
                  title="Select Start Date" 
                  onPress={() => setShowStartDateModal(true)} 
                  color="#6C5B7B"
                />
                <Button 
                  title="Select End Date" 
                  onPress={() => setShowEndDateModal(true)} 
                  color="#6C5B7B"
                />
              </View>

              <View style={styles.updateContainer}>
                <Button 
                  title={isUpdating ? "Updating..." : "Submit Changes"} 
                  onPress={handleUpdateDate} 
                  disabled={isUpdating || !newStartDate || !newEndDate} 
                  color="#6C5B7B"
                />
                {isUpdating && <ActivityIndicator size="small" color="#6C5B7B" style={styles.loader} />}
                {updateSuccess && <Text style={styles.successText}>{updateSuccess}</Text>}
                {updateError && <Text style={styles.errorText}>{updateError}</Text>}
              </View>
            </>
          )}
        </View>

        {activityData && (
          <View style={styles.activitiesContainer}>
            {trip.activities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <Text style={styles.activityTitle}>{activityData.getActivityById.title}</Text>
                <Text style={styles.activityDetails}>Price: {activityData.getActivityById.price}</Text>
                <Text style={styles.activityDetails}>Description: {activityData.getActivityById.description}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={showStartDateModal}
        onRequestClose={() => setShowStartDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Start Date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [newStartDate]: { selected: true, selectedColor: '#6C5B7B' } }}
              theme={{ selectedDayBackgroundColor: '#6C5B7B' }}
            />
            <View style={styles.modalButtons}>
              <Button title="Close" onPress={() => setShowStartDateModal(false)} color="#6C5B7B" />
              <Button
                title="Confirm Start Date"
                onPress={() => {
                  setShowStartDateModal(false);
                }}
                color="#6C5B7B"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showEndDateModal}
        onRequestClose={() => setShowEndDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select End Date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [newEndDate]: { selected: true, selectedColor: '#6C5B7B' } }}
              theme={{ selectedDayBackgroundColor: '#6C5B7B' }}
            />
            <View style={styles.modalButtons}>
              <Button title="Close" onPress={() => setShowEndDateModal(false)} color="#6C5B7B" />
              <Button
                title="Confirm End Date"
                onPress={() => {
                  setShowEndDateModal(false);
                }}
                color="#6C5B7B"
              />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'transparent', 
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, 
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#B0B0B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 16,
    color: '#32CD32',
    textAlign: 'center',
    marginTop: 10,
  },
  activitiesContainer: {
    marginTop: 20,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#B0B0B0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateContainer: {
    marginTop: 20,
  },
});

export default TripDetailScreen;
