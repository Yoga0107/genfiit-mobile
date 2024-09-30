import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingComponent: React.FC = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#0FA18C" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default LoadingComponent;
