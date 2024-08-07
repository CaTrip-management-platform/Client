import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation Mutation($password: String, $username: String) {
  login(password: $password, username: $username) {
    access_token
  }
}
`
export const GET_USER = gql`
query FindUserById($userId: String!) {
  findUserById(userId: $userId) {
    _id
    name
    username
    email
    password
  }
}

  `

export const REGISTER_USER = gql`
  mutation Register($name: String!, $username: String!, $email: String!, $password: String!, $image: String!) {
  register(name: $name, username: $username, email: $email, password: $password, image: $image) {
    message
  }
}
  `
export const GET_USER_BY_ID = gql`
query Query($userId: String!) {
  findUserById(userId: $userId) {
    _id
    email
    name
    password
    username
  }
}
`