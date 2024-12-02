import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { calculateBMI } from "../../helper/calculateBmiHelper";

type WeightBoxProps = {
  initialWeight: number; // Berat user
  height: number; // Tinggi badan user dalam cm
};

const WeightBox: React.FC<WeightBoxProps> = ({ initialWeight, height }) => {
  const bmi = calculateBMI(initialWeight, height);

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Kurang Gizi", color: "#FFC107" };
    if (bmi >= 18.5 && bmi < 24.9) return { status: "Normal", color: "#18B2A0" };
    if (bmi >= 25) return { status: "Obesitas", color: "#FF5722" };
    return { status: "Tidak Valid", color: "#6A6A71" };
  };

  const { status, color } = getBMIStatus(bmi);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Berat Badan</Text>
      <View style={styles.content}>
        <View style={styles.weightContainer}>
          <Text style={styles.weightValue}>{initialWeight} kg</Text>
          <Text style={styles.weightLabel}>Berat Awal</Text>
        </View>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: color }]} />
          <Text style={[styles.bmiStatus, { color }]}>{status}</Text>
        </View>
        <View style={styles.weightContainer}>
          <Text style={styles.weightValue}>{bmi.toFixed(1)}</Text>
          <Text style={styles.weightLabel}>BMI</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  weightContainer: {
    alignItems: "center",
    width: "30%",
  },
  weightValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18B2A0",
  },
  weightLabel: {
    fontSize: 12,
    color: "#6A6A71",
    marginTop: 4,
  },
  barContainer: {
    alignItems: "center",
    width: "40%",
  },
  bar: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    marginBottom: 8,
  },
  bmiStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default WeightBox;
