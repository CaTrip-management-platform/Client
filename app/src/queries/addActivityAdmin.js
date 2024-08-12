import { gql } from "@apollo/client";

export const ADD_ACTIVITY = gql`
mutation Mutation($title: String, $price: Int, $imgUrls: [String], $description: String, $tags: [String], $location: String, $coords: CoordinateInput) {
  addActivityForSeller(title: $title, price: $price, imgUrls: $imgUrls, description: $description, tags: $tags, location: $location, coords: $coords) {
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
}`;
