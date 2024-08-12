import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from "react-native";
import { GET_Activity } from "../queries/getAllActivity";
import { useQuery } from "@apollo/client";

const ActivityScreen = () => {
  const [activeView, setActiveView] = useState("Recommendations");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_Activity);
  const activities = data?.getAllActivity || [];
  // console.log(JSON.stringify(activities, null, 2));

  const handleAddToTimeline = () => {
    if (selectedActivity) {
      setTimeline([selectedActivity, ...timeline]);
      setSelectedActivity(null);
    } else {
      alert("Please select an activity first.");
    }
  };

  const handleDeleteActivity = (id) => {
    const updatedTimeline = timeline.filter((item) => item._id !== id);
    setTimeline(updatedTimeline);
  };

  const handleCloseDetails = () => {
    setSelectedActivity(null);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (selectedActivity?.imgUrls?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : selectedActivity.imgUrls.length - 1
      );
    }
  };

  const goToNextImage = () => {
    if (selectedActivity?.imgUrls?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < selectedActivity.imgUrls.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const renderActivityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() => setSelectedActivity(item)}
    >
      {item.imgUrls && item.imgUrls.length > 0 ? (
        <Image
          source={{ uri: item.imgUrls[0] }}
          style={styles.recommendationImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.recommendationDetails}>
        <Text style={styles.recommendationPrice}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg",
      }}
      style={styles.container}
    >
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            activeView === "Recommendations" && styles.selectedRole,
          ]}
          onPress={() => setActiveView("Recommendations")}
        >
          <Text
            style={[
              styles.roleText,
              activeView === "Recommendations" && styles.selectedRoleText,
            ]}
          >
            Recommendations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            activeView === "Timeline" && styles.selectedRole,
          ]}
          onPress={() => setActiveView("Timeline")}
        >
          <Text
            style={[
              styles.roleText,
              activeView === "Timeline" && styles.selectedRoleText,
            ]}
          >
            Timeline
          </Text>
        </TouchableOpacity>
      </View>

      {activeView === "Recommendations" && (
        <>
          <Text style={styles.header}>Available Activities</Text>

          <FlatList
            data={chunkArray(activities, 2)}
            keyExtractor={(item, index) => `chunk-${index}`}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {item.map((activity) => (
                  <View key={activity._id} style={styles.cardWrapper}>
                    {renderActivityCard({ item: activity })}
                  </View>
                ))}
              </View>
            )}
            contentContainerStyle={styles.cardContainer}
          />

          {selectedActivity && (
            <Modal
              transparent={true}
              visible={!!selectedActivity}
              animationType="fade"
              onRequestClose={handleCloseDetails}
            >
              <View style={styles.overlay}>
                <View style={styles.selectedActivityContainer}>
                  <View style={styles.imageContainer}>
                    {/* {selectedActivity.imgUrls && selectedActivity.imgUrls.length > 1 && (
                                            <TouchableOpacity onPress={goToPreviousImage} style={styles.navButton}>
                                                <Text style={styles.navButtonText}>{"<"}</Text>
                                            </TouchableOpacity>
                                        )} */}
                    {selectedActivity.imgUrls &&
                    selectedActivity.imgUrls.length > 0 ? (
                      <Image
                        source={{
                          uri: selectedActivity.imgUrls[currentImageIndex],
                        }}
                        style={styles.selectedActivityImage}
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>No Image</Text>
                      </View>
                    )}  
                    {selectedActivity.imgUrls &&
                      selectedActivity.imgUrls.length > 1 && (
                        <TouchableOpacity
                          onPress={goToNextImage}
                          style={styles.navButton}
                        >
                          <Text style={styles.navButtonText}>{">"}</Text>
                        </TouchableOpacity>
                      )}
                  </View>
                  <Text style={styles.selectedActivityTitle}>
                    {selectedActivity.title}
                  </Text>
                  <Text style={styles.selectedActivityDescription}>
                    {selectedActivity.description || "No Description"}
                  </Text>
                  <Text>Type :</Text>
                  {selectedActivity.types?.map((type, index) => (
                    <Text key={index}>
                      {type.name} - {type.price}
                    </Text>
                  ))}
                  <Text style={styles.selectedActivityRating}>
                    Rating: {selectedActivity.reviews?.[0]?.rating || "N/A"}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleCloseDetails}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddToTimeline}
                    >
                      <Text style={styles.addButtonText}>Add to Timeline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}

      {activeView === "Timeline" && (
        <>
          <Text style={styles.timelineHeader}>Timeline</Text>

          <FlatList
            data={timeline}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
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
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteActivity(item._id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  roleButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedRole: {
    backgroundColor: "#134B70",
  },
  roleText: {
    color: "#134B70",
    fontWeight: "bold",
  },
  selectedRoleText: {
    color: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  recommendationCard: {
    backgroundColor: "#FFF8F3",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
  },
  recommendationImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
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
  recommendationDetails: {
    padding: 10,
    alignItems: "center",
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  selectedActivityContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    elevation: 3,
    marginHorizontal: 20,
    marginVertical: 80,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#E4003A",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    padding: 10,
    backgroundColor: "#134B70",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedActivityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedActivityImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  selectedActivityDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedActivityRating: {
    fontSize: 16,
    marginBottom: 10,
  },
  timelineHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    borderLeftWidth: 2,
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
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF4C4C",
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  navButton: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: "#134B70",
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ActivityScreen;
