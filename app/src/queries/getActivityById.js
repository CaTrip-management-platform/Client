import { gql } from '@apollo/client';

export const GET_ACTIVITY_BY_ID = gql`
query GetActivityById($id: String) {
    getActivityById(_id: $id) {
      _id
      title
      price
      imgUrls
      reviews {
        content
        username
        rating
        createdAt
        updatedAt
      }
      description
      userId
      tags
      createdAt
      updatedAt
      customers
      location
      coords {
        latitude
        longitude
      }
    }
  } 
  `