import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

// Carousel data
const carouselData = [
  {
    id: "1",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Make Your Travel Seamless",
  },
  {
    id: "2",
    img: "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8OHx8dHJhdmVsfGVufDB8fDB8fHww",
    content: "Travel to Anywhere",
  },
  {
    id: "3",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
    content: "Travel Tips",
  },
];

const Carousel = () => {
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      flatListRef.current.scrollToIndex({
        index: activeIndex === carouselData.length - 1 ? 0 : activeIndex + 1,
        animated: true,
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activeIndex]);

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
          source={{ uri: item.img }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "black",
            opacity: 0.5,
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            position: "absolute",
            top: 90,
            fontSize: 20,
            color: "white",
          }}
        >
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={carouselData}
        keyExtractor={(item) => item.id}
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
        <DotIndicators activeIndex={activeIndex} />
      </View>
    </View>
  );
};

const DotIndicators = ({ activeIndex }) => {
  return carouselData.map((dot, index) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: index === activeIndex ? "gray" : "silver",
          height: 8,
          width: 8,
          borderRadius: 4,
          margin: 5,
        }}
      />
    );
  });
};

export default Carousel;
