import { gql } from '@apollo/client';


export const GET_POST = gql`
query Query {
  findPost {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      name
      email
      password
      image
    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`;


export const GET_SEARCH = gql`
query FindUser($search: String!) {
  findUser(search: $search) {
    _id
    name
    username
    email
    password,
  }
}`

export const GET_POST_BY_ID = gql`
query Query($postId: String!) {
  findPostById(postId: $postId) {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      name
      email
      password
      image

    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`
export const LIKE_POST = gql`
mutation AddLike($postId: String!) {
  addLike(postId: $postId) {
    message
  }
}
`
export const COMMET_POST = gql`
mutation AddComment($postId: String!, $content: String!) {
  addComment(postId: $postId, content: $content) {
    message
  }
}
`

export const ADD_POST = gql`
mutation AddPost($inputPost: NewPost) {
  addPost(inputPost: $inputPost) {
    message
  }
}
`