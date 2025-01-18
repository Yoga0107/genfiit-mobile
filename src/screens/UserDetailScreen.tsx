import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import InputComponent from "../components/InputComponent";
import CustomButton from "../components/Button/CustomButton";
import AlertModal from "../components/AlertModal"; // Import your AlertModal
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { UserDetailApi } from "../api/Auth";
import { getToken } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";
import { Picker } from "@react-native-picker/picker";

type UserDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserDetailScreen"
>;

const UserDetailScreen: React.FC = () => {
  const navigation = useNavigation<UserDetailScreenNavigationProp>();
  const [fullName, setFullName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getID();
      if (id) {
        setUserId(Number(id));
      }
    };
    fetchUserId();
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    const token = await getToken();

    if (!userId || !token || !dateOfBirth) {
      showAlert("Please fill in all fields.");
      return;
    }

    const epochDob = Math.floor(dateOfBirth.getTime() / 1000);
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = new Date().getMonth() - dateOfBirth.getMonth();
    const finalAge = monthDifference < 0 ? age - 1 : age;

    const userDetails = {
      full_name: fullName,
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: finalAge,
      dob: epochDob,
      gender: gender,
      users_permissions_user: {
        data: {
          id: userId.toString(),
        },
      },
    };

    try {
      await UserDetailApi(userDetails, token, userId.toString());
      showAlert("User details submitted successfully.");
      navigation.navigate("MainTabs");
    } catch (error: any) {
      showAlert(
        error.response?.data?.error?.message || "Failed to submit user details."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/login-chara.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Personal Data</Text>
      <Text style={styles.subtitle}>Before we started! Let us know about you!</Text>
      <InputComponent
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <InputComponent
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <InputComponent
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
        <Text style={styles.datePickerText}>
          {dateOfBirth ? dateOfBirth.toLocaleDateString() : "Date of Birth"}
        </Text>
        <MaterialIcons name="calendar-today" size={24} color="#0FA18C" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>
      <CustomButton title="Continue" onPress={handleSubmit} />
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0FA18C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0FA18C",
    borderRadius: 50,
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    marginBottom: "5%",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#0FA18C",
    borderRadius: 50,
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    color: "#333",
  },
});

export default UserDetailScreen;
