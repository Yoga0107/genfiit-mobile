// components/BoxComponents/WeightBox.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

type WeightBoxProps = {
  initialWeight: number; // Berat user dalam kg
  height: number; // Tinggi badan user dalam cm
  gender: string; // Gender user (male/female)
};

const WeightBox: React.FC<WeightBoxProps> = ({ initialWeight, height, gender }) => {
  // Menghitung IMT
  const calculateIMT = (weight: number, height: number) => {
    const heightInMeters = height / 100; // Konversi cm ke meter
    return weight / (heightInMeters * heightInMeters);
  };

  // Menghitung Berat Badan Ideal (BBI)
  const calculateBBI = (height: number, gender: string) => {
    return gender === "male" ? (height - 100) - (0.1 * (height - 100)) : (height - 100) - (0.15 * (height - 100));
  };

  // Menentukan status berdasarkan IMT
  const getIMTStatus = (imt: number) => {
    let status = "";
    let color = "";

    if (imt < 18.5) {
      status = "Underweight";
      color = "#FFC107"; // Kuning
    } else if (imt >= 18.5 && imt < 25) {
      status = "Normal Weight";
      color = "#18B2A0"; // Hijau
    } else if (imt >= 25 && imt < 30) {
      status = "Overweight";
      color = "#FF5722"; // Oranye
    } else {
      status = "Obesity";
      color = "#F44336"; // Merah
    }

    return { status, color };
  };

  const imt = calculateIMT(initialWeight, height);
  const bbi = calculateBBI(height, gender);
  const { status, color } = getIMTStatus(imt);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indeks Massa Tubuh (IMT)</Text>
      <View style={styles.content}>
        <View style={styles.weightContainer}>
          <Text style={styles.weightValue}>{initialWeight} kg</Text>
          <Text style={styles.weightLabel}>Berat Awal</Text>
        </View>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: color }]} />
          <Text style={[styles.imtStatus, { color }]}>{status}</Text>
          <Text style={styles.imtValue}>IMT: {imt.toFixed(1)}</Text>
        </View>
        <View style={styles.weightContainer}>
          <Text style={styles.weightValue}>{bbi.toFixed(1)} kg</Text>
          <Text style={styles.weightLabel}>BBI</Text>
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
  imtStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  imtValue: {
    fontSize: 12,
    color: "#6A6A71",
    marginTop: 4,
  },
});

export default WeightBox;
