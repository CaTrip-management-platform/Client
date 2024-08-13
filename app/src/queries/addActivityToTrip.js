import { gql } from "@apollo/client";

export const ADD_ACTIVITY_TO_TRIP = gql`
mutation AddActivityToTrip($activityInput: NewActivityTrip) {
  addActivityToTrip(activityInput: $activityInput) {
    message
  }
}
`;
