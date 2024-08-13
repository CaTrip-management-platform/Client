import { gql } from '@apollo/client';

export const UPDATE_ACTIVITY_QUANTITY = gql`
mutation Mutation($tripId: String!, $activityId: String!, $newQuantity: Int) {
  updateTripActivityQuantity(tripId: $tripId, activityId: $activityId, newQuantity: $newQuantity) {
    message
  }
}

  `