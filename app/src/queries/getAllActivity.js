import { gql } from "@apollo/client";

export const GET_Activity = gql`
query GetAllActivity {
  getAllActivity {
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
`; 
 