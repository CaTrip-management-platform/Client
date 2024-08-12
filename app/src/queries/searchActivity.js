import { gql } from '@apollo/client';

export const SEARCH_ACTIVITY = gql`
query Query($searchTerm: String) {
  searchActivity(searchTerm: $searchTerm) {
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
  }
}
`;
 