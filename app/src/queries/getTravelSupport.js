import { gql } from '@apollo/client';

export const GET_TRAVEL_SUPPORT = gql`
query Query($message: String!) {
    getTravelSupport(message: $message) {
      message
    }
  }
  `  