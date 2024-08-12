import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Button, StyleSheet, View } from "react-native";
import * as Location from "expo-location";

export default function Map({ route, navigation }) {
  const { name, location, coords } = route.params;
  const [mapLocation, setMapLocation] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState(null);
  const mapRef = useRef(null);

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
    console.log(name, location, coords, "<<<");
  }, []);

  const centerOnTarget = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: +coords.latitude,
          longitude: +coords.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        1000
      );
    }
  };

  return (
    <View style={styles.container}>
      {mapLocation && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: +coords.latitude,
            longitude: +coords.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker
            coordinate={{
              latitude: +coords.latitude,
              longitude: +coords.longitude,
            }}
            title={name}
          />
        </MapView>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Back to Target" onPress={centerOnTarget} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
});
