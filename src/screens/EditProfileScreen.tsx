import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getToken } from "../utils/handlingDataLogin"; // Utility untuk mengambil token dan ID
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/Button/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import SuccessAlert from "../components/Alerts/SuccessAlert"; // Importing the SuccessAlert
import { Picker } from '@react-native-picker/picker'; // Import Picker for gender
import DatePickerComponent from "../components/Picker/DatePicker";
import { getID } from "../utils/handlingDataRegister";

type RootStackParamList = {
  EditProfile: undefined;
};

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

type EditProfileScreenProps = {
  navigation: EditProfileScreenNavigationProp;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState<number | null>(null); // Menggunakan epoch untuk tanggal
  const [gender, setGender] = useState("male");
  const [userID, setUserID] = useState<number | null>(null); // Menyimpan userID
  const [token, setToken] = useState<string | null>(null); // Menyimpan token
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Ambil user ID dan token saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      } else {
        setAlertMessage("Token tidak ditemukan.");
        setAlertVisible(true);
        return;
      }

      const userID = await getID(); // Ambil ID pengguna yang tersimpan
      if (userID) {
        setUserID(userID); // Set ID pengguna
      } else {
        setAlertMessage("User ID tidak ditemukan.");
        setAlertVisible(true);
        return;
      }

      try {
        const response = await fetch(
          `https://api-genfiit.yanginibeda.web.id/api/users/${userID}?populate=user_detail`, // Gunakan userID yang didapat
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok && data && data.data && data.data.user_detail) {
          // Extract user detail ID
          const userDetailID = data.data.user_detail.id; // ID yang perlu digunakan untuk PUT request
          if (userDetailID) {
            setUserID(userDetailID); // Set userID dari user_detail
          } else {
            setAlertMessage("ID user detail tidak ditemukan.");
            setAlertVisible(true);
          }
        } else {
          setAlertMessage("Gagal mengambil data user.");
          setAlertVisible(true);
        }
      } catch (error) {
        setAlertMessage("Terjadi kesalahan: " + (error as Error).message);
        setAlertVisible(true);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!name || !height || !weight || !age || !dob) {
      setAlertMessage('Harap isi semua field.');
      setAlertVisible(true);
      return;
    }

    if (token && userID) {
      console.log("User Detail ID:", userID); // Pastikan ID ini sudah benar
      const requestBody = {
        data: {
          information: {
            full_name: name,
            height: parseInt(height),
            weight: parseInt(weight),
            age: parseInt(age),
            dob: dob, // Epoch timestamp
            gender: gender,
          },
        },
      };

      try {
        const response = await fetch(
          `https://api-genfiit.yanginibeda.web.id/api/user-details/${userID}`, // Menggunakan ID yang didapatkan dari user_detail
          {
            method: "PUT",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();
        console.log("Response Data:", data); // Log response untuk debugging

        if (response.ok) {
          setAlertMessage('Profile telah berhasil diubah!');
          setAlertVisible(true);
          setTimeout(() => {
            setAlertVisible(false);
            navigation.goBack();
          }, 2000);
        } else {
          setAlertMessage('Gagal memperbarui profile');
          setAlertVisible(true);
        }
      } catch (error) {
        const errMessage = (error as Error).message;
        setAlertMessage('Terjadi kesalahan: ' + errMessage);
        setAlertVisible(true);
      }
    }
  };

  return (
    <ResponsiveContainer>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/login-chara.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Please edit your profile</Text>

        <InputComponent
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <InputComponent
          placeholder="Height (Cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <InputComponent
          placeholder="Weight (Kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <InputComponent
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* DatePicker Component for DOB */}
        <DatePickerComponent
          value={dob || 0}
          onChange={setDob}
        />

        {/* Gender Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

        <ButtonComponent title="Save Change" onPress={handleSave} />

        <SuccessAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#0FA18C',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default EditProfileScreen;
