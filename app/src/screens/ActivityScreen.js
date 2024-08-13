import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_TRIPS_BY_CUSTOMER_ID } from "../queries/getTripsByCustomerId";

const ActivityScreen = () => {
  const [timeline, setTimeline] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { loading, error, data } = useQuery(GET_TRIPS_BY_CUSTOMER_ID);
  console.log(data);
  const dataToRender = data.getTripsByCustomerId;

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error retrieving data:", error);
      return [];
    }
  };

  const fetchTimeline = useCallback(async () => {
    const storedTimeline = await getData("timelineData");
    setTimeline(storedTimeline);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTimeline();
    }, [fetchTimeline])
  );

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  const keyExtractor = (item) =>
    item._id || item.id || `${item.title}-${item.date}`;

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
      }}
      style={styles.container}
    >
      <Text style={styles.timelineHeader}>Timeline</Text>

      {timeline.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text>No activities found.</Text>
        </View>
      ) : (
        <FlatList
          data={timeline}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOpenModal(item)}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineContainer}>
                    {item.imgUrls && item.imgUrls.length > 0 ? (
                      <Image
                        source={{ uri: item.imgUrls[0] }}
                        style={styles.timelineImage}
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>No Image</Text>
                      </View>
                    )}
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineRating}>
                      Rating: {item.reviews?.[0]?.rating || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Trip</Text>
            <FlatList
              data={dataToRender}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardText}>{item.destination}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  timelineHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    padding: 3,
    textAlign: "center",
    backgroundColor: "#134B70",
    color: "white",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#134B70",
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 25,
    paddingLeft: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#134B70",
    position: "relative",
  },
  timelineContainer: {
    backgroundColor: "white",
    padding: 10,
  },
  timelineImage: {
    width: "100%",
    height: 100,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineRating: {
    fontSize: 16,
    color: "#888",
  },
  placeholderImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});

export default ActivityScreen;
