import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ErrorModal = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.errorText}>Activity is already in the timeline!</Text>
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 15,
    },
});

export default ErrorModal;
