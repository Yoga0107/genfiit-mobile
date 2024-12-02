import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import InputComponent from "../components/InputComponent";
import CustomButton from "../components/Button/CustomButton";
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

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleSubmit = async () => {
    const token = await getToken();
    const userId = await getID();

    if (!userId || typeof userId !== "string") {
      Alert.alert("Error", "User ID not found or is invalid.");
      return;
    }

    if (!token || typeof token !== "string") {
      Alert.alert("Error", "Token not found or is invalid.");
      return;
    }

    if (!dateOfBirth) {
      Alert.alert("Error", "Please select your date of birth.");
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
    };

    try {
      const response = await UserDetailApi(userDetails, token, userId);

      Alert.alert("Success", "User details submitted successfully.");
      navigation.navigate("MainTabs");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error?.message || "Failed to submit user details."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Gambar di atas form */}
      <Image
        source={require("../../assets/login-chara.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Data Diri</Text>
      <Text style={styles.subtitle}>Sebelum kita lanjut, kenalan dulu yuk!</Text>

      <InputComponent
        placeholder="Nama Lengkap"
        value={fullName}
        onChangeText={setFullName}
      />
      <InputComponent
        placeholder="Tinggi (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <InputComponent
        placeholder="Berat (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* Picker untuk DOB */}
      <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
        <Text style={styles.datePickerText}>
          {dateOfBirth ? dateOfBirth.toLocaleDateString() : "Tanggal Lahir"}
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
                <Picker.Item label="Laki-laki" value="male" />
                <Picker.Item label="Perempuan" value="female" />
              </Picker>
      </View>

      <CustomButton title="Lanjutkan" onPress={handleSubmit} />
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
    borderColor: '#0FA18C',
    borderRadius: 50,
    marginBottom: 20
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
});

export default UserDetailScreen;
