import { gql } from '@apollo/client';

export const GET_TRIPS_BY_CUSTOMER_ID = gql`
query GetTripsByCustomerId {
  getTripsByCustomerId {
    _id
    destination
    activities {
      activityId
      quantity
      activityDate
    }
    totalPrice
    paymentStatus
    customerId
    startDate
    endDate
    createdAt
    updatedAt
    customer {
      username
      phoneNumber
    }
  }
} 
` 