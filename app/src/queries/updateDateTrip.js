import { gql } from '@apollo/client';

export const UPDATE_DATE = gql`
mutation Mutation($dateInput: UpdateTripDate!, $tripId: String!) {
    updateTripDate(dateInput: $dateInput, tripId: $tripId) {
      message
    }
  }
  `