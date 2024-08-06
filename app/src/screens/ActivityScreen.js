import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, ImageBackground, Modal } from 'react-native';

const activities = [
    { id: '1', title: 'Beach Day', description: 'A relaxing day at the beach.', price: 'Rp. 20.000,-', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Beach_at_Fort_Lauderdale.jpg/1200px-Beach_at_Fort_Lauderdale.jpg', rating: 4.5, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '2', title: 'Mountain Hike', description: 'A challenging hike up the mountains.', price: 'Rp. 30.000,-', image: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/topic_centers/2019-8/couple-hiking-mountain-climbing-1296x728-header.jpg?w=1155&h=1528', rating: 4.8, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '3', title: 'City Tour', description: 'Explore the city with a guided tour.', price: 'Rp. 50.000,-', image: 'https://independensi.com/wp-content/uploads/2017/08/170816-Bus-Wisata-Keliling-Ibukota-Jakarta-820x510.jpg', rating: 4.3, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '4', title: 'Museum Visit', description: 'A day at the local museum.', price: 'Rp. 10.500,-', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz0B0rqeiiqDVHeb6wg7WCfM533FKiGi4eaw&s', rating: 4.2, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '5', title: 'Spa Day', description: 'Relax with a full day at the spa.', price: 'Rp. 10.000,-', image: 'https://asset.kompas.com/crops/QoXV0nlDiIKBtT6g9kO_Ka-uNQI=/31x11:1000x657/750x500/data/photo/2023/05/08/645845b8c578c.jpg', rating: 4.7, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '6', title: 'Adventure Park', description: 'Fun activities at the adventure park.', price: 'Rp. 40.000,-', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCYLWItE-ABHS2YSwgoSQ7XvHLwcCpNBunBQ&s', rating: 4.6, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '7', title: 'Fishing Trip', description: 'A relaxing fishing experience.', price: 'Rp. 20.500,-', image: 'https://fishthewahoo.com/wp-content/uploads/2021/04/Fishing-Trip-Essentials--1080x675.jpg', rating: 4.4, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '8', title: 'Cooking Class', description: 'Learn to cook delicious dishes.', price: 'Rp. 30.500,-', image: 'https://mayaresorts.com/assets/images/ubud/experiences/cooking-class/gallery-full/cooking-class-full-1.jpg', rating: 4.7, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '9', title: 'Wine Tasting', description: 'Taste the best wines in the region.', price: 'Rp. 60.000,-', image: 'https://media.cntraveler.com/photos/56e2d06e2c9cfa640d949071/master/pass/Wine-Tasting-Demetrius-Fordham.jpg', rating: 4.8, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
    { id: '10', title: 'Yoga Retreat', description: 'Relax and rejuvenate at the yoga retreat.', price: 'Rp. 80.000,-', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/83/7d/82/anamaya-resort-retreat.jpg?w=700&h=-1&s=1', rating: 4.9, reviews: [{ user: 'Alice', comment: 'Amazing experience!', rating: 5 }, { user: 'Bob', comment: 'Really enjoyed the day.', rating: 4 }] },
];

const ActivityScreen = () => {
    const [activeView, setActiveView] = useState('Recommendations');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [timeline, setTimeline] = useState([]);

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
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.recommendationImage} />
            ) : null}
            <View style={styles.recommendationDetails}>
                <Text style={styles.recommendationTitle}>{item.title}</Text>
                <Text style={styles.recommendationPrice}>{item.price}</Text>
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
                    <Text style={[styles.roleText, activeView === 'Timeline' && styles.selectedRoleText]}>Timeline</Text>
                </TouchableOpacity>
            </View>

            {activeView === 'Recommendations' && (
                <>
                    <Text style={styles.header}>Available Activities</Text>

                    <FlatList
                        data={chunkArray(activities, 2)}
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
                    <Text style={styles.timelineHeader}>Timeline</Text>

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