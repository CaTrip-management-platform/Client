import { gql } from '@apollo/client';


export const GET_ACTIVITY = gql`
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
  createdAt
  updatedAt
  customers
  location
}
}
`;

