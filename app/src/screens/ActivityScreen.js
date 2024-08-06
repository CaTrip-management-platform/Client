import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ImageBackground, Modal } from 'react-native';
import { GET_Activity } from '../queries/getAllActivity';
import { useQuery } from '@apollo/client';



const ActivityScreen = () => {
    const [activeView, setActiveView] = useState('Recommendations');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [timeline, setTimeline] = useState([]);

    const { loading, error, data } = useQuery(GET_Activity);
    const activity = data.getAllActivity
    const handleAddToTimeline = () => {
        if (selectedActivity) {
            setTimeline([selectedActivity, ...timeline]);
            setSelectedActivity(null);
        } else {
            alert('Please select an activity first.');
        }
    };

    const handleDeleteActivity = (id) => {
        const updatedTimeline = timeline.filter(item => item.id !== id);
        setTimeline(updatedTimeline);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    const renderActivityCard = ({ item }) => (
        <TouchableOpacity
            style={styles.recommendationCard}
            onPress={() => setSelectedActivity(item)}
        >
            {console.log(item.getAllActivity, '<====================')}
            {item.imgUrls ? (
                <Image source={{ uri: item.imgUrls }} style={styles.recommendationImage} />
            ) : null}
            <View style={styles.recommendationDetails}>
                {/* <Text style={styles.recommendationTitle}>{item.title}</Text> */}
                <Text style={styles.recommendationPrice}>{item.description}</Text>
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
            source={{ uri: "https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg" }}
            style={styles.container}>
            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, activeView === 'Recommendations' && styles.selectedRole]}
                    onPress={() => setActiveView('Recommendations')}
                >
                    <Text style={[styles.roleText, activeView === 'Recommendations' && styles.selectedRoleText]}>Recommendations</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, activeView === 'Timeline' && styles.selectedRole]}
                    onPress={() => setActiveView('Timeline')}
                >
                    <Text style={[styles.roleText, activeView === 'Timeline' && styles.selectedRoleText]}>Activities</Text>
                </TouchableOpacity>
            </View>

            {activeView === 'Recommendations' && (
                <>
                    <Text style={styles.header}>Available Activities</Text>

                    <FlatList
                        data={chunkArray(activity, 2)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                {item.map(activity => (
                                    <View key={activity.id} style={styles.cardWrapper}>
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
                                    {selectedActivity.image ? (
                                        <Image source={{ uri: selectedActivity.image }} style={styles.selectedActivityImage} />
                                    ) : null}
                                    <Text style={styles.selectedActivityTitle}>{selectedActivity.title}</Text>
                                    <Text style={styles.selectedActivityDescription}>{selectedActivity.description}</Text>
                                    <Text style={styles.selectedActivityPrice}>{selectedActivity.price}</Text>
                                    <Text style={styles.selectedActivityRating}>Rating: {selectedActivity.rating}</Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.addButton} onPress={handleAddToTimeline}>
                                            <Text style={styles.addButtonText}>Add to Timeline</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                </>
            )}

            {activeView === 'Timeline' && (
                <>
                    <Text style={styles.timelineHeader}>List</Text>

                    <FlatList
                        data={timeline}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineContent}>
                                    {item.image ? (
                                        <Image source={{ uri: item.image }} style={styles.timelineImage} />
                                    ) : null}
                                    <Text style={styles.timelineTitle}>{item.title}</Text>
                                    <Text style={styles.timelineDescription}>{item.description}</Text>
                                    <Text style={styles.timelinePrice}>{item.price}</Text>
                                    <Text style={styles.timelineRating}>Rating: {item.rating}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteActivity(item.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
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
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    roleButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 25,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedRole: {
        backgroundColor: '#134B70',
    },
    roleText: {
        color: '#134B70',
        fontWeight: 'bold',
    },
    selectedRoleText: {
        color: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        // color: '#03346E'
    },
    cardContainer: {
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    cardWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
    recommendationCard: {
        backgroundColor: '#FFF8F3',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        padding: 10,
    },
    recommendationImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    recommendationDetails: {
        padding: 10,
        alignItems: 'center',
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recommendationPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    selectedActivityContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        padding: 10,
        elevation: 3,
        marginHorizontal: 20,
        marginVertical: 80,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    selectedActivityContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#E4003A',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    addButton: {
        padding: 10,
        backgroundColor: '#134B70',
        borderRadius: 5,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    selectedActivityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedActivityImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    selectedActivityDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    selectedActivityPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedActivityRating: {
        fontSize: 16,
        marginBottom: 10,
    },
    timelineHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 20,
        // padding: 5
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#134B70',
        marginRight: 10,
    },
    timelineContent: {
        flex: 1,
        paddingVertical: 25,
        paddingLeft: 15,
        borderLeftWidth: 2,
        borderLeftColor: '#134B70',
        position: 'relative',
    },
    timelineImage: {
        width: '100%',
        height: 100,
        marginBottom: 10,
    },
    timelineTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timelineDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    timelinePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    timelineRating: {
        fontSize: 16,
        color: '#888',
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF4C4C',
        borderRadius: 5,
        padding: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ActivityScreen;