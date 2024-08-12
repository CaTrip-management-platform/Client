import { gql } from '@apollo/client';

export const ADD_TRIP_USER = gql`
    mutation AddTrip($tripInput: NewTrip) {
        addTrip(tripInput: $tripInput) {
            message
        }
    }
`;
 




