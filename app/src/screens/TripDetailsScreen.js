import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function TripDetailsScreen({ route }) {
    // const totalPrice = trip.activities.reduce((sum, activity) => sum + activity.price, 0);
    const trip = {
            "_id": "66b990c42a1d478f78d13793",
            "destination": "Jerman",
            "activities": [
              {
                "activityId": "66b3358a46eb1f01dc034abf",
                "quantity": 3,
                "activityDate": "2020-01-01T00:00:00.000Z",
                "price": 1317000,
                "Activity": {
                  "_id": "66b3358a46eb1f01dc034abf",
                  "title": "Kintamani Cafe Sunrise 4WD Jeep Adventure with Photographer",
                  "price": 439000,
                  "imgUrls": [
                    "https://res.klook.com/image/upload/c_fill,w_627,h_470/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/asux7hp1vajezcmzrla3.webp",
                    "https://res.klook.com/image/upload/c_fill,w_1265,h_712/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jmukn3diynnhnvdxywjt.webp",
                    "https://res.klook.com/image/upload/c_fill,w_1265,h_712/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jmukn3diynnhnvdxywjt.webp"
                  ],
                  "description": "Explore Mt Batur with 4WD Jeep and feel offroad sensation. Visit Kintamani cafe (EL Lago Bali) after Explore Mt Batur and enjoy a panoramic views of the volcano and the lake Batur. Take the best photo with sunrise in front of you as Background. You will be accompanied by a professional photographer who is experienced in capturing the best moments and scenes",
                  "tags": [
                    "Hotel pick up",
                    "English/Bahasa Indonesia"
                  ],
                  "location": "Bali"
                }
              }
            ],
            "totalPrice": 1317000,
            "paymentStatus": "Pending",
            "customerId": "66b1ab1a1f8a522270a599d2",
            "startDate": "2024-10-31T17:00:00.000Z",
            "endDate": "2024-11-30T17:00:00.000Z",
            "createdAt": "2024-08-12T04:34:12.084Z",
            "updatedAt": "2024-08-12T04:34:12.084Z"
          }
        
      

    const handleBuy = () => {
        // Implement buy functionality here
        console.log('Buy button pressed');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{trip.destination}</Text>
            <Text style={styles.dates}>{trip.startDate.toDateString()} - {trip.endDate.toDateString()}</Text>

            {trip.activities.map((activity, index) => (
                <View key={index} style={styles.card}>
                    <Image
                        source={{ uri: activity.Activity.imgUrls[0] }}
                        style={styles.image}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.activityTitle}>{activity.Activity.title}</Text>
                        <Text style={styles.description}>{activity.Activity.description}</Text>
                        <Text style={styles.price}>${activity.price}</Text>
                        <Text style={styles.quantity}>Quantity: {activity.quantity}</Text>
                        <Text style={styles.date}>{activity.activityDate.toDateString()}</Text>
                    </View>
                </View>
            ))}

            <View style={styles.totalContainer}>
                <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dates: {
        fontSize: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
    },
    cardContent: {
        padding: 16,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    quantity: {
        fontSize: 14,
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
    },
    totalContainer: {
        marginTop: 16,
        marginBottom: 16,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


