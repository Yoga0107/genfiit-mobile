import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/Button/ButtonComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ResponsiveContainer from "../components/ResponsiveContainer";
import HeaderComponent from "../components/Header";
import { fetchMedicalProfessionals } from "../api/MedicalProfessional";
import { postTelehealthData } from "../api/Telehealth";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  MedicalProfessionalSelectionScreen: { selectedProgram: string; age: string };
};

const TelehealthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [fullName, setFullName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step === 3) {
      const loadProfessionals = async () => {
        setLoading(true);
        try {
          const data = await fetchMedicalProfessionals();

          // Filter professionals based on selected program
          const filteredProfessionals = data.filter((item: any) => {
            if (selectedProgram === "Nutrition") {
              return (
                item.attributes.job_title === "Nutrisionist" ||
                item.attributes.job_title === "Dietisien"
              );
            } else if (selectedProgram === "Mental Health") {
              return item.attributes.job_title === "Psikolog";
            }
            return true;
          });

          setProfessionals(
            filteredProfessionals.map((item: any) => ({
              id: item.id, // ID dari konsultan
              name: item.attributes.name,
              job: item.attributes.job_title,
              schedule: item.attributes.schedule,
              str: item.attributes.str_number,
            }))
          );

          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Failed to fetch professionals. Please try again.");
        }
      };
      loadProfessionals();
    }
  }, [step, selectedProgram]);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleLanjutPress = async () => {
    if (step === 1) {
      if (!fullName || !weight || !height || !gender || !dateOfBirth) {
        Alert.alert(
          "Incomplete Data!",
          "Please fill all the field data!",
          [{ text: "OK" }]
        );
        return;
      }
      setStep(2);
    } else if (step === 2 && selectedProgram) {
      setStep(3);
    } else if (step === 3 && selectedProgram && selectedProfessional) {
      const age = calculateAge(dateOfBirth);

      let category = "";
      let programme = "";

      if (selectedProgram === "Mental Health") {
        category = "mental_health";
        programme = "Mental Health";
      } else if (selectedProgram === "Nutrition") {
        category = "gizi";
        programme = "Nutrition";
      } else {
        Alert.alert(
          "Application Error",
          "Choosed program is not valid!",
          [{ text: "OK" }]
        );
        return;
      }

      const data = {
        category,
        programme,
        user: {
          name: fullName,
          weight: parseInt(weight),
          height: parseInt(height),
          dob: Math.floor(dateOfBirth.getTime() / 1000),
          gender,
        },
        professional: selectedProfessional, // ID konsultan
      };

      try {
        await postTelehealthData(data, selectedProgram);
        navigation.navigate("Home");
        alert(
          "Consultation has been made! Please check notification!"
        );
      } catch (error) {
        Alert.alert(
          "Failed send data",
          "There is problem, Try Again!",
          [{ text: "OK" }]
        );
        console.error("Failed to submit telehealth data:", error);
      }
    } else if (step === 2 && !selectedProgram) {
      Alert.alert(
        "Program must be choosen!",
        "Please choose the program!.",
        [{ text: "OK" }]
      );
    } else if (step === 3 && (!selectedProfessional || !selectedProgram)) {
      Alert.alert(
        "Data incomplete!",
        "Please choose professionalist to continue!.",
        [{ text: "OK" }]
      );
    }
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let ageInYears = today.getFullYear() - dob.getFullYear();
    let ageInMonths = today.getMonth() - dob.getMonth();

    if (ageInMonths < 0) {
      ageInYears--;
      ageInMonths += 12;
    }

    return `${ageInYears} Years ${ageInMonths} Month`;
  };

  const isButtonDisabled = () => {
    if (step === 1) {
      return !fullName || !weight || !height || !gender || !dateOfBirth;
    } else if (step === 2) {
      return !selectedProgram;
    } else if (step === 3) {
      return !selectedProfessional;
    }
    return false;
  };

  return (
    <ResponsiveContainer>
      <HeaderComponent title="Konsultasi" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <Text style={styles.title}>Telehealth</Text>
            <Text style={styles.subtitle}>Consultation with professional!</Text>
            <Text style={styles.description}>
            Before you can consult directly with a health professional, let's fill it in
            your personal data here!
            </Text>

            <InputComponent
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <InputComponent
              placeholder="Weight (Kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <InputComponent
              placeholder="Height (Cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Text style={styles.dateLabel}>Consultation Date</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {dateOfBirth
                  ? dateOfBirth.toLocaleDateString()
                  : "Date of Birth"}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color="#0FA18C" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
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

            <ButtonComponent
              title="Contine"
              onPress={handleLanjutPress}
              disabled={isButtonDisabled()}
            />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Text style={styles.title}>Choose Program</Text>
            <Text style={styles.titleDescription}>
            Choose the consulting program you need!
            </Text>

            <TouchableOpacity
              style={[
                styles.programButton,
                selectedProgram === "Mental Health" && styles.selectedButton,
              ]}
              onPress={() => setSelectedProgram("Mental Health")}
            >
              <Image
                source={require("../../assets/mental-notif.png")}
                style={styles.programLogo}
              />
              <View style={styles.programTextContainer}>
                <Text style={styles.programTitle}>Mental Health</Text>
                <Text style={styles.programDescription}>
                For those who want consultation regarding mental health, confide,
                or for those who have problems regulating emotions.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.programButton,
                selectedProgram === "Nutrition" && styles.selectedButton,
              ]}
              onPress={() => setSelectedProgram("Nutrition")}
            >
              <Image
                source={require("../../assets/gizi-notif.png")}
                style={styles.programLogo}
              />
              <View style={styles.programTextContainer}>
                <Text style={styles.programTitle}>Nutrition</Text>
                <Text style={styles.programDescription}>
                For those who want consultation regarding nutrition, diet and...
                healthy eating pattern.
                </Text>
              </View>
            </TouchableOpacity>

            <ButtonComponent
              title="Continue"
              onPress={handleLanjutPress}
              disabled={isButtonDisabled()}
            />
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <Text style={styles.title}>Choose Professional</Text>
            <Text style={styles.titleDescription}>
            Choose the professional staff you want.
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#18B2A0" />
            ) : (
              <ScrollView style={styles.professionalItem}>
                {professionals.map((professional, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.professionalItem,
                      selectedProfessional === professional.id &&
                        styles.selectedButton,
                    ]}
                    onPress={() => setSelectedProfessional(professional.id)}
                  >
                    <Text style={styles.professionalName}>
                      {professional.name}
                    </Text>
                    <Text style={styles.professionalDetails}>
                      {professional.job}
                    </Text>
                    <Text style={styles.professionalDetails}>
                      Schedule: {professional.schedule}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <ButtonComponent
              title="Continue"
              onPress={handleLanjutPress}
              disabled={isButtonDisabled()}
            />
          </>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    color: "#0FA18C",
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
    color: "#666",
  },
  pickerContainer: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0FA18C",
  },
  picker: {
    textAlign: "center",
    height: 30,
    width: "100%",
    color: "#333",
  },
  programButton: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedButton: {
    borderColor: "#0FA18C",
    backgroundColor: "#f4f7f9",
  },
  programLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  programTextContainer: {
    flex: 1,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  programDescription: {
    fontSize: 14,
    color: "#666",
  },
  titleDescription: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  professionalItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },

  professionalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  professionalDetails: {
    fontSize: 14,
    color: "#666",
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
    color: "#333",
    flex: 1,
    fontSize: 16,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TelehealthScreen;
