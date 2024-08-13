import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const TravelTipsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Travel Tips</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipWrapper}>
            <Text style={styles.tipNumber}>{index + 1}.</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const tips = [
  "Keep your belongings secure at all times.",
  "Always have a copy of your important documents.",
  "Be aware of local customs and regulations.",
  "Stay hydrated and take breaks during long trips.",
  "Learn basic phrases in the local language.",
  "Use reliable transportation options.",
  "Avoid sharing personal information with strangers.",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  tipWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginRight: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default TravelTipsScreen;
