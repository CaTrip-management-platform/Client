import { gql } from '@apollo/client';

export const ADD_Activity = gql`
mutation AddActivityForSeller($title: String, $types: [TicketInput], $imgurls: [String], $description: String, $tags: [String], $location: String) {
    addActivityForSeller(title: $title, types: $types, imgurls: $imgurls, description: $description, tags: $tags, location: $location) {
      _id
      title
      types {
        name
        price
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
      createdAt
      updatedAt
      customers
      location
    }
  }
  `