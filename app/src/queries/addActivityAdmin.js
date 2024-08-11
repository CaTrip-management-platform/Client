import { gql } from "@apollo/client";

export const ADD_ACTIVITY = gql`
mutation AddActivityForSeller($title: String, $price: Int, $imgurls: [String], $description: String, $tags: [String], $location: String) {
  addActivityForSeller(title: $title, price: $price, imgurls: $imgurls, description: $description, tags: $tags, location: $location, coords: $coords) {
    _id
    title
    price
    imgUrls
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
    reviews {
      content
      username
      rating
      createdAt
      updatedAt
    }
  }
}`;
