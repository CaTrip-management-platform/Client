import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { GET_POST } from "../queries/posts.js";
import { ActivityIndicator } from "react-native-paper";
import Card from "../components/homeCard.js";
import { FontAwesome5 } from "@expo/vector-icons";
import { ADD_POST } from "../queries/posts.js";

const HomeScreen = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_POST, {
    onCompleted: () => {
      refetch();
    },
  });
  const [addPost] = useMutation(ADD_POST, {
    //  onCompleted: () => {
    //   refetch();
    // },
  });

  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (data && data.findPost) {
      setPosts(data.findPost);
    }
  }, [data]);

  const handleAddPost = async () => {
    try {
      await addPost({
        variables: {
          inputPost: {
            content: postContent,
            tags: tags ? tags.split(",") : [],
            imgUrl: imgUrl || null,
          },
        },
      });

      setPostContent("");
      setTags("");
      setImgUrl("");
      setModalVisible(false);
    } catch (err) {
      console.error("Error adding post:", err.message || err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        {posts.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate("Detail", {
                _id: item._id,
              });
            }}
          >
            <Card card={item} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>
          <FontAwesome5 name="feather-alt" size={24} color="black" />
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What’s on your mind?</Text>
            <TextInput
              style={styles.input}
              placeholder="What's happening?"
              value={postContent}
              onChangeText={setPostContent}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Hashtag (#)"
              value={tags}
              onChangeText={setTags}
            />
            <TextInput
              style={styles.input}
              placeholder="Your Image Url..."
              value={imgUrl}
              onChangeText={setImgUrl}
            />
            <TouchableOpacity
              style={[styles.button, styles.postButton]}
              onPress={handleAddPost}
            >
              <Text style={styles.buttonText}>Posting</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgb(29, 155, 240)",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    fontSize: 24,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  postButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default HomeScreen;
