import { gql } from "@apollo/client";

export const SEARCH_ACTIVITY = gql`
query Query($searchTerm: String) {
  searchActivity(searchTerm: $searchTerm) {
    _id
    title
    location
    imgUrls
    description
    price
    reviews {
      content
      username
      rating
      createdAt
      updatedAt
    }
    tags
    coords {
      latitude
      longitude
    }
  }
}
`;
