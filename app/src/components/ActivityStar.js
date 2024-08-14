import { View, Text } from "react-native";
import React from "react";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const ActivityStar = ({ rating }) => {
  return (
    <View style={{ width: 20, height: 20, marginVertical: 3 }}>
      <StarRatingDisplay rating={rating} starSize={16} />
    </View>
  );
};

export default ActivityStar;
