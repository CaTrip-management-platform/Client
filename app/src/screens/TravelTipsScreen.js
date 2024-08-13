import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TravelTipsScreen() {
  const tips = [
    "Keep your valuables secure and always be aware of your surroundings.",
    "Always have a copy of your passport and important documents in case they are lost or stolen.",
    "Check travel advisories and health warnings for your destination before you leave.",
    "Learn a few basic phrases in the local language to help with communication.",
    "Make sure you have travel insurance that covers medical emergencies and trip cancellations.",
    "Keep a list of emergency contacts, including the local embassy or consulate.",
    "Be cautious with public Wi-Fi and avoid accessing sensitive information on unsecured networks.",
    "Carry a small first aid kit and any personal medications you may need.",
    "Use reliable transportation options and avoid traveling alone at night in unfamiliar areas.",
    "Respect local customs and cultural norms to have a more enjoyable and respectful travel experience."
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Travel Tips</Text>
      <Text style={styles.description}>
        Here are some essential tips and advice to help you stay safe and enjoy your travels:
      </Text>
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipContainer}>
          <Text style={styles.tipNumber}>{index + 1}.</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
