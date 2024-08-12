import { gql } from "@apollo/client";

export const GET_Activity = gql`
query GetAllActivity {
  getAllActivity {
    _id
    title
    types {
      price
      name
    }
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
    sellerId
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
