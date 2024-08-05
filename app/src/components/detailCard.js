import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { COMMET_POST, GET_POST_BY_ID, LIKE_POST } from "../queries/posts";
import * as SecureStore from "expo-secure-store"
import { jwtDecode } from "jwt-decode";

const Card = ({ card }, params) => {
  const {
    author,
    content,
    createdAt,
    imgUrl,
    comments = [],
    likes = [],
    tags = [],
_id
  } = card;

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [commentCount, setCommentCount] = useState(comments.length);

  const authorImage =
    author && author.image
      ? author.image
      : "https://i0.wp.com/terpanas.id/wp-content/uploads/2017/07/VIDEO-LUCU-ORANG-UTAN-SAAT-CARI-PERHATIAN-3.jpg?resize=590%2C350";

  const authorName = author ? author.name : "Unknown";

  const formattedDate = formatDate(createdAt);


  const [user, setUser] = useState("");

    const fetchTokenData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        // console.log(token)
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();



  const { email, username, image } = user;

  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
    variables: { postId: _id },
    onCompleted: () => {
      setLikeCount(likeCount + 1);
    },
    refetchQueries: [GET_POST_BY_ID],
  });

  const [commentPost, { loading: commentLoading, data: dataComment }] = useMutation(COMMET_POST, {
    variables: { postId: _id, content: newComment },
    onCompleted: (data) => {
      console.log(data)
      if (data && data.addComment) {
        const { id, message } = data.addComment;
        setCommentCount(commentCount + 1);
        setAllComments([
          ...allComments,
          { text: newComment, author: username, id: id },
        ]);
        setNewComment("");
      }
    },
    refetchQueries: [GET_POST_BY_ID],
  });

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await commentPost();
    }
  };

  const handleLike = async () => {
    await likePost();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: authorImage }} />
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{authorName}</Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
        </View>
        <Text style={styles.tweetText}>{content}</Text>
        {tags.length > 0 && (
          <Text style={styles.tweetTags}>{tags.join(", ")}</Text>
        )}
        {imgUrl && (
          <Image
            style={styles.tweetImage}
            source={{ uri: imgUrl }}
            resizeMode="cover"
          />
        )}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.footerText}>
              <FontAwesome name="comment-o" size={24} color="white" />{" "}
              {comments.length} Comments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} disabled={likeLoading}>
            <Text style={styles.footerText}>
              <AntDesign name="like2" size={24} color="white" /> {likes.length}{" "}
              Likes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showComments}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.commentsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Text style={styles.commentText}>
                  {comment.username}: {comment.content}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddComment}
              disabled={commentLoading}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowComments(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  tweetTags: {
    fontSize: 14,
    color: "lightgray",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  commentsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  comment: {
    marginBottom: 10,
  },
  commentText: {
    color: "white",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "white",
    color: "black",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Card;
