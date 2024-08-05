import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, SafeAreaView } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_SEARCH } from '../queries/posts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useFonts,
  FiraSans_100Thin,
  FiraSans_100Thin_Italic,
  FiraSans_200ExtraLight,
  FiraSans_200ExtraLight_Italic,
  FiraSans_300Light,
  FiraSans_300Light_Italic,
  FiraSans_400Regular,
  FiraSans_400Regular_Italic,
  FiraSans_500Medium,
  FiraSans_500Medium_Italic,
  FiraSans_600SemiBold,
  FiraSans_600SemiBold_Italic,
  FiraSans_700Bold,
  FiraSans_700Bold_Italic,
  FiraSans_800ExtraBold,
  FiraSans_800ExtraBold_Italic,
  FiraSans_900Black,
  FiraSans_900Black_Italic,
} from "@expo-google-fonts/fira-sans";

const SearchScreen = () => {
  const [text, setText] = useState('');

  const { data, loading, error } = useQuery(GET_SEARCH, {
    variables: { search: text },
    skip: !text,
    fetchPolicy: 'no-cache',
  });

  // console.log(data, "searchn <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
  
  
  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultText}>{item.name}</Text>
    </View>
  );
          let [fontsLoaded] = useFonts({
            FiraSans_100Thin,
            FiraSans_100Thin_Italic,
            FiraSans_200ExtraLight,
            FiraSans_200ExtraLight_Italic,
            FiraSans_300Light,
            FiraSans_300Light_Italic,
            FiraSans_400Regular,
            FiraSans_400Regular_Italic,
            FiraSans_500Medium,
            FiraSans_500Medium_Italic,
            FiraSans_600SemiBold,
            FiraSans_600SemiBold_Italic,
            FiraSans_700Bold,
            FiraSans_700Bold_Italic,
            FiraSans_800ExtraBold,
            FiraSans_800ExtraBold_Italic,
            FiraSans_900Black,
            FiraSans_900Black_Italic,
          });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Cari"
            placeholderTextColor="white"
            style={styles.input}
            value={text}
            onChangeText={setText}
            />
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="search" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={data?.findUser || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada hasil</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "black"
  },
  searchContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    color: "white"
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "white"
    
  },
  iconWrapper: {
    paddingLeft: 10,
  },
  resultsList: {
    flex: 1,
    color: "white"
  },
  resultText: {
    color: "white",
    fontFamily:"FiraSans_800ExtraBold"
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: "white"
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#aaa',
  },
});

export default SearchScreen;


