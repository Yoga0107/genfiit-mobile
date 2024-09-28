import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

// Define the shape of the BMI reference data
type BMIData = {
  "-3SD": number;
  "-2SD": number;
  "-1SD": number;
  median: number;
  "+1SD": number;
  "+2SD": number;
  "+3SD": number;
};

type ReferenceBMIData = {
  boys: Record<number, BMIData>;
  girls: Record<number, BMIData>;
};

// WHO reference BMI data for boys and girls aged 14-18
const referenceBMIData: ReferenceBMIData = {
  boys: {
    14: {
      "-3SD": 15.7,
      "-2SD": 16.9,
      "-1SD": 18.1,
      median: 19.5,
      "+1SD": 21.1,
      "+2SD": 22.9,
      "+3SD": 24.8,
    },
    15: {
      "-3SD": 16.0,
      "-2SD": 17.3,
      "-1SD": 18.5,
      median: 19.9,
      "+1SD": 21.5,
      "+2SD": 23.4,
      "+3SD": 25.4,
    },
    16: {
      "-3SD": 16.3,
      "-2SD": 17.6,
      "-1SD": 18.9,
      median: 20.3,
      "+1SD": 22.0,
      "+2SD": 24.0,
      "+3SD": 26.0,
    },
    17: {
      "-3SD": 16.5,
      "-2SD": 17.8,
      "-1SD": 19.2,
      median: 20.7,
      "+1SD": 22.4,
      "+2SD": 24.4,
      "+3SD": 26.5,
    },
    18: {
      "-3SD": 16.7,
      "-2SD": 18.0,
      "-1SD": 19.4,
      median: 21.0,
      "+1SD": 22.7,
      "+2SD": 24.8,
      "+3SD": 26.9,
    },
  },
  girls: {
    14: {
      "-3SD": 15.5,
      "-2SD": 16.7,
      "-1SD": 17.9,
      median: 19.2,
      "+1SD": 20.7,
      "+2SD": 22.4,
      "+3SD": 24.2,
    },
    15: {
      "-3SD": 15.6,
      "-2SD": 16.8,
      "-1SD": 18.0,
      median: 19.4,
      "+1SD": 20.9,
      "+2SD": 22.6,
      "+3SD": 24.5,
    },
    16: {
      "-3SD": 15.7,
      "-2SD": 17.0,
      "-1SD": 18.2,
      median: 19.7,
      "+1SD": 21.2,
      "+2SD": 23.0,
      "+3SD": 24.9,
    },
    17: {
      "-3SD": 15.8,
      "-2SD": 17.1,
      "-1SD": 18.4,
      median: 19.9,
      "+1SD": 21.5,
      "+2SD": 23.3,
      "+3SD": 25.3,
    },
    18: {
      "-3SD": 15.9,
      "-2SD": 17.2,
      "-1SD": 18.5,
      median: 20.1,
      "+1SD": 21.7,
      "+2SD": 23.6,
      "+3SD": 25.6,
    },
  },
};

const BMICalculator: React.FC = () => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("boys");
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  const calculateBMI = () => {
    if (height === 0 || weight === 0 || age === 0 || !referenceBMIData[gender])
      return;

    // Convert height from cm to meters
    const heightInMeters = height / 100;

    // BMI formula
    const calculatedBMI = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI);

    // Get the reference data for the age and gender
    const genderData = referenceBMIData[gender];
    const ageData = genderData[age];

    if (!ageData) {
      setBmiCategory("Age data not available");
      return;
    }

    // Determine the category based on SD ranges
    let category = "";
    if (calculatedBMI < ageData["-3SD"]) category = "Severely underweight";
    else if (
      calculatedBMI >= ageData["-3SD"] &&
      calculatedBMI < ageData["-2SD"]
    )
      category = "Moderately underweight";
    else if (
      calculatedBMI >= ageData["-2SD"] &&
      calculatedBMI < ageData["-1SD"]
    )
      category = "Mildly underweight";
    else if (
      calculatedBMI >= ageData["-1SD"] &&
      calculatedBMI <= ageData["+1SD"]
    )
      category = "Normal weight";
    else if (
      calculatedBMI > ageData["+1SD"] &&
      calculatedBMI <= ageData["+2SD"]
    )
      category = "Overweight";
    else if (calculatedBMI > ageData["+2SD"]) category = "Obese";

    setBmiCategory(category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator (Ages 14-18)</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Age (14-18)"
        value={age ? age.toString() : ""}
        onChangeText={(text) => setAge(Number(text))}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender (boys/girls)"
        value={gender}
        onChangeText={setGender}
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Weight (kg)"
        value={weight ? weight.toString() : ""}
        onChangeText={(text) => setWeight(Number(text))}
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Height (cm)"
        value={height ? height.toString() : ""}
        onChangeText={(text) => setHeight(Number(text))}
      />

      <Button title="Calculate BMI" onPress={calculateBMI} />

      {bmi && (
        <View style={styles.result}>
          <Text>Your BMI: {bmi.toFixed(2)}</Text>
          <Text>BMI Category: {bmiCategory}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
  },
});

export default BMICalculator;
