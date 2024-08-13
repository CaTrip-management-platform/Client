import { gql } from "@apollo/client";

export const DELETE_ACTIVITY = gql`
mutation DeleteActivityFromTrip($tripId: String!, $activityId: String!) {
    deleteActivityFromTrip(tripId: $tripId, activityId: $activityId) {
      message
    }
  }

`