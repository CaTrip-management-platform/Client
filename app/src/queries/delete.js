import { gql } from "@apollo/client";

export const DELETE_ACTIVITY = gql`
mutation DeleteActivityForSeller($activityId: String!) {
  deleteActivityForSeller(activityId: $activityId)
}`;
