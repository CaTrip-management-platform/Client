import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";

export default function Map({ name, location, coords }) {
  const [mapLocation, setMapLocation] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setDeniedMessage("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {mapLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            title={"test"}
          />
        </MapView>
        // <MapView
        //   style={StyleSheet.absoluteFill}
        //   provider={PROVIDER_GOOGLE}
        //   showsUserLocation={true}
        //   showsMyLocationButton={true}
        //   //   initialRegion={{
        //   //     latitude: location.coords.latitude,
        //   //     longitude: location.coords.longitude,
        //   //     latitudeDelta: 0.0922,
        //   //     longitudeDelta: 0.0421,
        //   //   }}
        // />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
