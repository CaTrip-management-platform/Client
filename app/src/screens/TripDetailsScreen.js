import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CREATE_PAYMENT, CREATE_REVIEW, GET_TRIPS_BY_ID } from '../queries/getTripById';
import { ActivityIndicator, Button, Modal } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import ReviewModal from '../components/ReviewModal';

export default function TripDetailsScreen({ route }) {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [modal, setModal] = useState(false)
    const [paid, setPaid] = useState(true)
    const [paymentUrl, setPaymentUrl] = useState("")
    const [activeCard, setActiveCard] = useState("")
    const [paymentFn, { loading: loadingPayment, error: errorPayment, data: dataPayment }] = useMutation(CREATE_PAYMENT)
    const [reviewFn, { loading: loadingReview, error: errorReview, data: dataReview }] = useMutation(CREATE_REVIEW)
    const { loading, error, data } = useQuery(GET_TRIPS_BY_ID, {
        variables: { tripId: route.params._id },
    },);


    if (loading) {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const trip = data.getTripById
    useEffect(() => {
        if (trip.paymentStatus == "Paid") {
            setPaid(true)
        }
    }, []);

    const totalPrice = trip.activities.reduce((sum, activity) => sum + activity.price, 0);

    const handleBuy = async () => {
        try {
            const result = await paymentFn({ variables: { tripId: route.params._id, amount: totalPrice } });
            setPaymentUrl(dataPayment.createPayment.redirectUrl)
            setModal(true)
            setPaid(true)
        }
        catch (err) {
            console.log(error)
        }
    };

    return (
        <>
            {modal && (
                <WebView
                    style={styles.webview}
                    source={{ uri: paymentUrl }}
                    onNavigationStateChange={(navState) => {
                        console.log(navState.url, "<==========navState.urlss")
                        // if (!navState.url.includes('https://app.sandbox.midtrans.com/snap')) {
                        setModal(false);
                        setShowReviewModal(true);
                        //   }
                    }}
                />
            )}
            {!modal && (

                <ScrollView style={styles.container}>
                    <Text style={styles.title}>{trip.destination}</Text>
                    <Text style={styles.dates}>{trip.startDate} - {trip.endDate}</Text>

                    {trip.activities.map((activity, index) => (
                        <View key={index} style={styles.card}>
                            <Image
                                source={{ uri: activity.Activity.imgUrls[0] }}
                                style={styles.image}
                            />
                            <View style={styles.cardContent}>
                                <Text style={styles.activityTitle}>{activity.Activity.title}</Text>
                                {paid && <Button onPress={() => {    
                                    setActiveCard(activity.activityId)
                                    setShowReviewModal(true) }}>
                                    Review
                                </Button>}
                                <View style={styles.barisBawah}>
                                    <Text style={styles.price}>Rp{activity.price}</Text>
                                    <Text style={styles.quantity}>Tickets: {activity.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalPrice}>Total Price: Rp{trip.totalPrice}</Text>
                    </View>

                    <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>

                </ScrollView>
            )}
            <ReviewModal
                visible={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={async (reviewData) => {
                    let { rating, review } = reviewData
                    // console.log(rating, review, activeCard)
                    try {
                        const result = await reviewFn({ variables: { activityId: activeCard, content: review, rating:rating } });
                        console.log("Review success!")
                    } catch (error) {
                        console.log("Error while reviewing:", error)
                    }
                    
                    setActiveCard("")

                }}
            />

        </>
    );
};

const styles = StyleSheet.create({
    reviewModalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    webview: {
        flex: 1,
        zIndex: 3,
        elevation: 3,
    },
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
    barisBawah: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        // backgroundColor: 'green',
        color: 'green',

    },
    quantity: {
        fontSize: 16,
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


