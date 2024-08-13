import { gql } from "@apollo/client";

export const GET_TRIPS_BY_ID = gql`
query Query($tripId: String!) {
 getTripById(tripId: $tripId) {
    _id
    destination
    activities {
      activityId
      quantity
      activityDate
      price
      Activity {
        _id
        title
        price
        imgUrls
        description
        tags
        location
      }
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
`;
export const CREATE_PAYMENT = gql`
mutation Mutation($tripId: String!, $amount: Float!) {
  createPayment(tripId: $tripId, amount: $amount) {
    orderId
    redirectUrl
    success
    token
  }
}`;

export const CREATE_REVIEW = gql`
mutation Mutation($activityId: String, $content: String, $rating: Int) {
  reviewActivity(activityId: $activityId, content: $content, rating: $rating) {
    reviews {
      content
      createdAt
      rating
      updatedAt
      username
    }
  }
}
`;
