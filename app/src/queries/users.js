import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation Mutation($password: String, $username: String) {
  login(password: $password, username: $username) {
    access_token
    role
    id
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
 mutation CreateUser($phoneNumber: String, $username: String, $email: String, $password: String) {
  createUser(phoneNumber: $phoneNumber, username: $username, email: $email, password: $password) {
    _id
    username
    email
    password
    phoneNumber
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