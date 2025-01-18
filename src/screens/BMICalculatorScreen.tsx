import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import HeaderComponent from "../components/Header";
import InputComponent from "../components/InputComponent";
import CustomButton from "../components/Button/CustomButton";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { calculateBMI, getBMICategory } from "../helper/calculateBmiHelper";
import { getBmiHistory, postBMIHistory } from "../api/bmiHistory";
import { getToken, getIDuserdetail } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";

const { width } = Dimensions.get("window");

const BMICalculatorScreen: React.FC = () => {
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("boys");
  const [weight, setWeight] = useState<number>(0);
  const [heightInput, setHeight] = useState<number>(0);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchBMIHistory();
  }, []);

  const fetchBMIHistory = async () => {
    try {
      const token = await getToken();
      let userId = await getID();

      if (!userId) {
        userId = await getIDuserdetail();
      }

      if (token && userId) {
        const data = await getBmiHistory();
        setHistory(data.data);
      } else {
        console.error("Token or User ID is missing.");
      }
    } catch (error) {
      console.error("Failed to fetch BMI history:", error);
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "kurus ringan":
      case "kurus":
        return "user-times"; // Ikon orang kurus
      case "normal":
        return "user"; // Ikon orang normal
      case "gemuk ringan":
      case "gemuk":
        return "user-plus"; // Ikon orang gemuk
      default:
        return "question-circle"; // Ikon default
    }
  };

  const handleCalculateBMI = async () => {
    if (heightInput === 0 || weight === 0 || age === 0) {
      console.log("Please ensure all inputs are provided.");
      return;
    }

    if (age < 1 || age > 99) {
      console.log("Age must be between 1 and 99.");
      setBmiCategory("Age not available");
      return;
    }

    const calculatedBMI = calculateBMI(weight, heightInput);
    setBmi(calculatedBMI);

    const category = getBMICategory(calculatedBMI, age, gender as "boys" | "girls");
    setBmiCategory(category);
    setModalVisible(true);

    try {
      await postBMIHistory(
        age,
        gender === "boys" ? "male" : "female",
        heightInput,
        weight,
        calculatedBMI.toFixed(2)
      );
      fetchBMIHistory();
    } catch (error) {
      console.error("Failed to post BMI history:", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setAge(0);
    setGender("boys");
    setWeight(0);
    setHeight(0);
    setBmi(null);
    setBmiCategory("");
  };

  const renderHistoryItem = ({ item }: { item: any }) => {
    const category = getBMICategory(
      item.attributes.result,
      item.attributes.age,
      item.attributes.gender === "male" ? "boys" : "girls"
    );
    

    const getCategoryBackgroundColor = (category: string) => {
      switch (category.toLowerCase()) {
        case "kurus ringan":
          return "#FFF9C4"; // Kuning
        case "normal":
          return "#C8E6C9"; // Hijau
        case "gemuk ringan":
          return "#FFE0B2"; // Oranye
        case "kurus":
        case "gemuk":
          return "#FFCDD2"; // Merah
        default:
          return "#e9ecef"; // Default
      }
    };

       const getCategoryIcon = (category: string) => {
      switch (category.toLowerCase()) {
        case "kurus ringan":
        case "kurus":
          return "user-times"; // Ikon orang kurus
        case "normal":
          return "user"; // Ikon orang normal
        case "gemuk ringan":
        case "gemuk":
          return "user-plus"; // Ikon orang gemuk
        default:
          return "question-circle"; // Ikon default
      }
    };

    const backgroundColor = getCategoryBackgroundColor(category);

      return (
        <View style={[styles.historyItem, { backgroundColor }]}>
        <Text style={styles.historyText}>Age: {item.attributes.age}</Text>
        <Text style={styles.historyText}>Gender: {item.attributes.gender === "male" ? "Male" : "Female"}</Text>
        <Text style={styles.historyText}>Height: {item.attributes.height} cm</Text>
        <Text style={styles.historyText}>Weight: {item.attributes.weight} kg</Text>
        <Text style={styles.historyText}>BMI: {item.attributes.result}</Text>
        <Text
          style={[styles.historyText, styles.calculatedAt]}
        >
          {new Date(item.attributes.createdAt).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>
      );
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderComponent title="BMI Calculator" />

        <View style={styles.inputContainer}>
          <InputComponent
            placeholder="Age"
            value={age ? age.toString() : ""}
            onChangeText={(text) => {
              const newAge = Number(text);
              setAge(isNaN(newAge) ? 0 : newAge);
            }}
            keyboardType="numeric"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="boys" />
              <Picker.Item label="Female" value="girls" />
            </Picker>
          </View>

          <InputComponent
            placeholder="Weight (kg)"
            value={weight ? weight.toString() : ""}
            onChangeText={(text) => {
              const newWeight = Number(text);
              setWeight(isNaN(newWeight) ? 0 : newWeight);
            }}
            keyboardType="numeric"
          />

          <InputComponent
            placeholder="Height (cm)"
            value={heightInput ? heightInput.toString() : ""}
            onChangeText={(text) => {
              const newHeight = Number(text);
              setHeight(isNaN(newHeight) ? 0 : newHeight);
            }}
            keyboardType="numeric"
          />
        </View>

        <View>
          <CustomButton title="Calculate BMI" onPress={handleCalculateBMI} />
        </View>

        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <FontAwesome 
        name={getCategoryIcon(bmiCategory)} 
        size={50} 
        color="#0FA18C" 
        style={{ marginBottom: 10 }} 
      />
      <Text style={styles.resultText}>Your BMI: {bmi?.toFixed(2)}</Text>
      <Text style={styles.resultText}>BMI Category: {bmiCategory}</Text>
      <CustomButton title="Close" onPress={handleCloseModal} />
    </View>
  </View>
</Modal>


        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>BMI History</Text>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.historyList}
          />
        </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#f8f9fa",
      alignItems: "center",
      paddingTop: 20,
    },
    inputContainer: {
      marginTop: 50,
      width: "90%",
      marginBottom: 20,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#0FA18C',
      borderRadius: 50,
      marginBottom: 20,
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
    historyContainer: {
      marginTop: 20,
      width: "90%",
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    historyList: {
      width: "100%",
    },
    historyItem: {
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    historyText: {
      fontSize: 14,
    },
    resultText: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 5,
    },
    calculatedAt: {
      position: "absolute",
      top: 10,
      right: 10,
      fontSize: 12,
      color: "#666",
    },
  });

  export default BMICalculatorScreen;

  