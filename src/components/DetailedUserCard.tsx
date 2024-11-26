import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { calculateBMR, calculateNutritionalNeeds, NutritionalNeeds } from '../helper/nutritionHelper';
import { FontAwesome6 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

type DetailedUserCardProps = {
  name: string;
  height: number;
  weight: number;
  dob: Date;
  nutritionalStatus: string;
  email: string;
  username: string;
};

const DetailedUserCard: React.FC<DetailedUserCardProps> = ({ name, height, weight, dob, nutritionalStatus, email, username }) => {
  const age = new Date().getFullYear() - dob.getFullYear();
  const ageAdjusted = new Date().getMonth() < dob.getMonth() ? age - 1 : age; 

  const bmr = calculateBMR(weight, height, ageAdjusted);  
  const nutritionalNeeds: NutritionalNeeds = calculateNutritionalNeeds(bmr);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Image source={require("../../assets/iconHeight.png")} style={styles.icon} />
          <View>
            <Text style={styles.infoValue}>{height}</Text>
            <Text style={styles.infoLabel}>Tinggi (Cm)</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Image source={require("../../assets/iconWeight.png")} style={styles.icon} />
          <View>
            <Text style={styles.infoValue}>{weight}</Text>
            <Text style={styles.infoLabel}>Berat (Kg)</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Image source={require("../../assets/iconIdeal.png")} style={styles.icon} />
          <View>
            <Text style={styles.infoValue}>{nutritionalStatus}</Text>
            <Text style={styles.infoLabel}>Body Mass Index (BMI)</Text>
          </View>
        </View>
      </View>

      <View style={styles.bmrSection}>
        <Text style={styles.bmrLabel}>Basal Metabolic Rate (BMR)</Text>
        <Text style={styles.bmrValue}>{bmr} Kalori</Text>
      </View>

      <View style={styles.nutrientsSection}>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientValue}>{nutritionalNeeds.protein}</Text>
          <Text style={styles.nutrientLabel}>Protein</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientValue}>{nutritionalNeeds.fat}</Text>
          <Text style={styles.nutrientLabel}>Lemak</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Text style={styles.nutrientValue}>{nutritionalNeeds.carbs}</Text>
          <Text style={styles.nutrientLabel}>Karbohidrat</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#18B2A0",
    alignItems: "center",
    marginBottom: 20,
    width: '110%'
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18B2A0",
  },
  username: {
    fontSize: 16,
    color: "#6A6A71",
    marginVertical: 2,
  },
  email: {
    fontSize: 16,
    color: "#6A6A71",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingBottom: 8,
  },
  infoSection: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 20,
    color: "#18B2A0",
    fontWeight: "bold",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6A6A71",
  },
  bmrSection: {
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
    width: "100%",
    alignItems: "center",
    paddingTop: 15,
    marginBottom: 20,
  },
  bmrLabel: {
    fontSize: 14,
    color: "#6A6A71",
  },
  bmrValue: {
    fontSize: 22,
    color: "#18B2A0",
    fontWeight: "bold",
  },
  nutrientsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  nutrientItem: {
    alignItems: "center",
  },
  nutrientValue: {
    fontSize: 20,
    color: "#18B2A0",
    fontWeight: "bold",
  },
  nutrientLabel: {
    fontSize: 14,
    color: "#6A6A71",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18B2A0",
    paddingVertical: 10,
    width: "195%",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  editButtonText: {
    flexDirection: "row",
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8
  },
});

export default DetailedUserCard;
