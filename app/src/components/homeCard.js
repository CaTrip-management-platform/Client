import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  useFonts,
  FiraSans_600SemiBold_Italic,
} from "@expo-google-fonts/fira-sans";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const Card = ({ card }) => {
  const {
    author,
    content,
    createdAt,
    imgUrl,
    comments = [],
    likes = [],
    tags = [],
  } = card;

  const [fontsLoaded] = useFonts({
    FiraSans_600SemiBold_Italic,
  });

  const formattedDate = formatDate(createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri:
              author?.image ||
              "https://i0.wp.com/terpanas.id/wp-content/uploads/2017/07/VIDEO-LUCU-ORANG-UTAN-SAAT-CARI-PERHATIAN-3.jpg?resize=590%2C350",
          }}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{author?.name || "Unknown"}</Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
        </View>
        <Text style={styles.tweetText}>{content}</Text>
        <Text style={styles.tweetText}>{tags.join(", ")}</Text>
        {imgUrl && (
          <Image
            style={styles.tweetImage}
            source={{ uri: imgUrl }}
            resizeMode="cover"
          />
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <FontAwesome name="comment-o" size={24} color="white" />{" "}
            {comments.length} Comments
          </Text>
          <Text style={styles.footerText}>
            <AntDesign name="like2" size={24} color="white" /> {likes.length}{" "}
            Likes
          </Text>
        </View>
      </View>
    </View>
  );
};

const formatDate = (dateString) => {
  let date;

  if (!isNaN(dateString)) {
    date = new Date(parseInt(dateString, 10));
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    backgroundColor: "#1A2130",
    padding: 10,
    borderRadius: 10,
  },
  avatarContainer: {
    paddingRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  card: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "FiraSans_600SemiBold_Italic",
  },
  timestamp: {
    fontSize: 14,
    color: "grey",
  },
  tweetText: {
    fontSize: 16,
    lineHeight: 24,
    color: "white",
  },
  tweetImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "white",
  },
});

export default Card;
