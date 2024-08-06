import { gql } from '@apollo/client';

export const GET_Activity = gql`
query Query {
    getAllActivity {
      _id
      title
      types {
        price
        name
      }
      imgUrls
      reviews {
        content
        username
        rating
        createdAt
        updatedAt
      }
      description
      sellerId
      tags
      customers
      location
      createdAt
      updatedAt
    }
  }
  `