import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserDetailApi } from "../api/Auth";
import { getToken } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type UserDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDetailScreen'>;

const UserDetailScreen: React.FC = () => {
  const navigation = useNavigation<UserDetailScreenNavigationProp>();
  const [fullName, setFullName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [showPicker, setShowPicker] = useState(false);

  const handleDobChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dob;
    setShowPicker(false);
    setDob(currentDate);
  };

  const handleSubmit = async () => {
    const token = await getToken();
    const userId = await getID();
  
    if (!userId || typeof userId !== 'string') {
      Alert.alert("Error", "User ID not found or is invalid.");
      return;
    }
  
    if (!token || typeof token !== 'string') {
      Alert.alert("Error", "Token not found or is invalid.");
      return;
    }
  
    const epochDob = Math.floor(dob.getTime() / 1000);
    const age = new Date().getFullYear() - dob.getFullYear();
    const monthDifference = new Date().getMonth() - dob.getMonth();
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
      Alert.alert("Error", error.response?.data?.error?.message || "Failed to submit user details.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill Your Details</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text>{`Date of Birth: ${dob.toLocaleDateString()}`}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dob}
          mode="date"
          is24Hour={true}
          onChange={handleDobChange}
        />
      )}

      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0FA18C",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UserDetailScreen;
