import { gql } from "@apollo/client";

export const GET_Activity = gql`
query GetAllActivity {
  getAllActivity {
    _id
    title
    imgUrls
    reviews {
      content
      username
      rating
      createdAt
      updatedAt
    }
    description

    tags
    createdAt
    updatedAt
    customers
    location
    price
    userId
  }
}
`;
