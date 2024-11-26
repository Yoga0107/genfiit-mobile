import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, Modal, TouchableOpacity } from "react-native";
import HeaderComponent from "../components/Header";  
import InputComponent from "../components/InputComponent";  
import CustomButton from "../components/CustomButton";  
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the icon

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

const referenceBMIData: ReferenceBMIData = {
  boys: {
    14: { "-3SD": 15.7, "-2SD": 16.9, "-1SD": 18.1, median: 19.5, "+1SD": 21.1, "+2SD": 22.9, "+3SD": 24.8 },
    15: { "-3SD": 16.0, "-2SD": 17.3, "-1SD": 18.5, median: 19.9, "+1SD": 21.5, "+2SD": 23.4, "+3SD": 25.4 },
    16: { "-3SD": 16.3, "-2SD": 17.6, "-1SD": 18.9, median: 20.3, "+1SD": 22.0, "+2SD": 24.0, "+3SD": 26.0 },
    17: { "-3SD": 16.5, "-2SD": 17.8, "-1SD": 19.2, median: 20.7, "+1SD": 22.4, "+2SD": 24.4, "+3SD": 26.5 },
    18: { "-3SD": 16.7, "-2SD": 18.0, "-1SD": 19.4, median: 21.0, "+1SD": 22.7, "+2SD": 24.8, "+3SD": 26.9 },
  },
  girls: {
    14: { "-3SD": 15.5, "-2SD": 16.7, "-1SD": 17.9, median: 19.2, "+1SD": 20.7, "+2SD": 22.4, "+3SD": 24.2 },
    15: { "-3SD": 15.6, "-2SD": 16.8, "-1SD": 18.0, median: 19.4, "+1SD": 20.9, "+2SD": 22.6, "+3SD": 24.5 },
    16: { "-3SD": 15.7, "-2SD": 17.0, "-1SD": 18.2, median: 19.7, "+1SD": 21.2, "+2SD": 23.0, "+3SD": 24.9 },
    17: { "-3SD": 15.8, "-2SD": 17.1, "-1SD": 18.4, median: 19.9, "+1SD": 21.5, "+2SD": 23.3, "+3SD": 25.3 },
    18: { "-3SD": 15.9, "-2SD": 17.2, "-1SD": 18.5, median: 20.1, "+1SD": 21.7, "+2SD": 23.6, "+3SD": 25.6 },
  },
};

const { width } = Dimensions.get("window");

const BMICalculator: React.FC = () => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("boys");
  const [weight, setWeight] = useState<number>(0);
  const [heightInput, setHeight] = useState<number>(0);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const calculateBMI = () => {
    if (heightInput === 0 || weight === 0 || age === 0 || !referenceBMIData[gender as keyof ReferenceBMIData]) return;

    const heightInMeters = heightInput / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI);

    const genderData = referenceBMIData[gender as keyof ReferenceBMIData];
    const ageData = genderData[age];

    if (!ageData) {
      setBmiCategory("Age data not available");
      return;
    }

    let category = "";
    if (calculatedBMI < ageData["-3SD"]) category = "Severely underweight";
    else if (calculatedBMI >= ageData["-3SD"] && calculatedBMI < ageData["-2SD"]) category = "Moderately underweight";
    else if (calculatedBMI >= ageData["-2SD"] && calculatedBMI < ageData["-1SD"]) category = "Mildly underweight";
    else if (calculatedBMI >= ageData["-1SD"] && calculatedBMI <= ageData["+1SD"]) category = "Normal weight";
    else if (calculatedBMI > ageData["+1SD"] && calculatedBMI <= ageData["+2SD"]) category = "Overweight";
    else if (calculatedBMI > ageData["+2SD"]) category = "Obese";

    setBmiCategory(category);
    setModalVisible(true); // Show the modal when calculation is done
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent title="BMI Calculator" />

      <View style={styles.inputContainer}>
        <InputComponent
          placeholder="Age (14-18)"
          value={age ? age.toString() : ""}
          onChangeText={(text) => setAge(Number(text))}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Gender" value="" />
            <Picker.Item label="Laki-laki" value="boys" />
            <Picker.Item label="Perempuan" value="girls" />
          </Picker>
        </View>

        <InputComponent
          placeholder="Weight (kg)"
          value={weight ? weight.toString() : ""}
          onChangeText={(text) => setWeight(Number(text))}
          keyboardType="numeric"
        />

        <InputComponent
          placeholder="Height (cm)"
          value={heightInput ? heightInput.toString() : ""}
          onChangeText={(text) => setHeight(Number(text))}
          keyboardType="numeric"
        />
      </View>

      <View>
        <CustomButton title="Calculate BMI" onPress={calculateBMI} />
      </View>

      {/* Modal for displaying results */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome name="check-circle" size={30} color="#0FA18C" />
            <Text style={styles.resultText}>Your BMI: {bmi?.toFixed(2)}</Text>
            <Text style={styles.resultText}>BMI Category: {bmiCategory}</Text>
            <CustomButton title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    paddingTop: 50,
  },
  inputContainer: {
    marginTop: 50,
    width: "90%",
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 50,
    marginBottom: 20
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: width - 60,
    alignItems: "center",
  },
});

export default BMICalculator;
