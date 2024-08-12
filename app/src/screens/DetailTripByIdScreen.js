import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_TRIP_BY_ID } from '../queries/getTripById';
import { GET_ACTIVITY_BY_ID } from '../queries/getActivityById';

function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  
  // Query untuk mengambil detail trip
  const { loading: tripLoading, error: tripError, data: tripData } = useQuery(GET_TRIP_BY_ID, {
    variables: { tripId, caches: 'no-cache' },
  });

  // Mendapatkan ID aktivitas dari trip
  const activityIds = tripData?.getTripById.activities.map(activity => activity.activityId) || [];

  // Query untuk mengambil detail aktivitas
  const { loading: activityLoading, error: activityError, data: activityData } = useQuery(GET_ACTIVITY_BY_ID, {
    variables: { id: activityIds[0] }, // Mengambil ID aktivitas pertama sebagai contoh
    skip: activityIds.length === 0, // Jangan jalankan query jika tidak ada ID aktivitas
  });

  if (tripLoading || activityLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (tripError || activityError) {
    return <Text style={styles.errorText}>Error! {tripError?.message || activityError?.message}</Text>;
  }

  const trip = tripData?.getTripById;

  if (!trip) {
    return <Text style={styles.errorText}>Trip not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.destination || 'Destination not available'}</Text>
      <Text style={styles.details}>Start Date: {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Not available'}</Text>
      <Text style={styles.details}>End Date: {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'Not available'}</Text>
      <Text style={styles.details}>Total Price: {trip.totalPrice ?? 'Not available'}</Text>
      <Text style={styles.details}>Payment Status: {trip.paymentStatus || 'Not available'}</Text>

      {activityData && (
        <View style={styles.activitiesContainer}>
          {trip.activities.map((activity, index) => (
            <View key={index} style={styles.activity}>
              <Text style={styles.activityTitle}>{activityData.getActivityById.title}</Text>
              <Text style={styles.activityDetails}>Price: {activityData.getActivityById.price}</Text>
              <Text style={styles.activityDetails}>Description: {activityData.getActivityById.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  activitiesContainer: {
    marginTop: 20,
  },
  activity: {
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDetails: {
    fontSize: 16,
  },
});

export default TripDetailScreen;
