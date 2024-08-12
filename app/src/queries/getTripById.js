import { gql } from '@apollo/client';

export const GET_TRIP_BY_ID = gql`
query GetTripById($tripId: String!) {
    getTripById(tripId: $tripId) {
      _id
      destination
      activities {
        activityId
        quantity
        activityDate
      }
      totalPrice
      paymentStatus
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
  `