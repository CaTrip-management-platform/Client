import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

const DetailCarousel = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const handleScroll = (e) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Image
          style={{ width: screenWidth, height: 200 }}
          source={{ uri: item }}
        />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data.imgUrls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onScroll={handleScroll}
        horizontal
        pagingEnabled
        snapToInterval={screenWidth}
        showsHorizontalScrollIndicator={false}
      />
      <View
        style={{ flexDirection: "row", justifyContent: "center", bottom: 20 }}
      >
        <DotIndicators activeIndex={activeIndex} imgUrls={data.imgUrls} />
      </View>
    </View>
  );
};

const DotIndicators = ({ activeIndex, imgUrls }) => {
  return imgUrls.map((dot, index) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: index === activeIndex ? "black" : "silver",
          height: 8,
          width: 8,
          borderRadius: 4,
          margin: 5,
        }}
      />
    );
  });
};

export default DetailCarousel;
