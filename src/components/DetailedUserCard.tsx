import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type NutritionNeeds = {
  protein: number;
  fat: number;
  carbs: number;
};

type DetailedUserCardProps = {
  name: string;
  height: number;
  weight: number;
  dob: number;
  gender: 'male' | 'female';
  nutritionalStatus: string;
  email: string;
  username: string;
};

const DetailedUserCard: React.FC<DetailedUserCardProps> = ({ name, height, weight, dob, gender, nutritionalStatus, email, username }) => {
  const age = calculateAge(dob);
  const bbi = calculateBBI(height, gender);
  const stressFactor = 1.3;
  const bmr = calculateBMR(weight, height, age, gender, stressFactor);  
  const nutritionalNeeds: NutritionNeeds = calculateNutritionNeeds(bmr);

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
        <Text style={styles.bmrLabel}>Kebutuhan Energi</Text>
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
    alignSelf: "flex-start",
  },
  username: {
    fontSize: 16,
    color: "#6A6A71",
    marginVertical: 2,
    alignSelf: "flex-start",
  },
  email: {
    fontSize: 16,
    color: "#6A6A71",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingBottom: 8,
    alignSelf: "flex-start",
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
});

function calculateAge(dob: number): number {
  const currentDate = new Date();
  const birthDate = new Date(dob * 1000);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
}

function calculateBBI(height: number, gender: 'male' | 'female'): number {
  return gender === 'male' ? height - 100 : height - 104;
}

function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  stressFactor: number = 1.3
): number {
  let bmr: number;
  if (gender === 'male') {
    bmr = (66 + (13.7 * weight) + (5 * height) - (6.8 * age)) * stressFactor * stressFactor;
  } else {
    bmr = (655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)) * stressFactor * stressFactor;
  }
  return parseFloat(bmr.toFixed(1)); 
}

function calculateNutritionNeeds(bmr: number): NutritionNeeds {
  const protein = parseFloat((bmr * 0.20 / 4).toFixed(1));
  const fat = parseFloat((bmr * 0.30 / 9).toFixed(1));
  const carbs = parseFloat((bmr * 0.50 / 4).toFixed(1));
  return { protein, fat, carbs };
}

export default DetailedUserCard;
