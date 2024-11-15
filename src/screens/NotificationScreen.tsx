import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import ResponsiveContainer from "../components/ResponsiveContainer";
import HeaderComponent from "../components/Header";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const NotificationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <ResponsiveContainer>
            <HeaderComponent title="Notification"/>

            <View style={styles.container}>
                <NotificationBox 
                    icon="restaurant" 
                    date="Senin, 1 Oktober 2024 - 11.00" 
                    title="Konsultasi Gizi" 
                    healthWorker="Andre Eko" 
                    status="Sedang Berjalan" 
                    statusColor="orange" 
                    buttonEnabled 
                />
                <NotificationBox 
                    icon="psychology" 
                    date="Senin, 1 Oktober 2024 - 11.00" 
                    title="Konsultasi Mental Health" 
                    healthWorker="Andre Eko" 
                    status="Selesai!" 
                    statusColor="green" 
                    buttonEnabled={false} 
                />
            </View>
        </ResponsiveContainer>
    );
};


interface NotificationBoxProps {
    icon: "restaurant" | "psychology";
    date: string;
    title: string;
    healthWorker: string;
    status: string;
    statusColor: string;
    buttonEnabled: boolean;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ icon, date, title, healthWorker, status, statusColor, buttonEnabled }) => (
    <View style={styles.notificationBox}>
        <View style={styles.headerRow}>
            <MaterialIcons name={icon} size={24} color="#F57C00" />
            <View style={styles.textContainer}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
        
        <Text style={styles.healthWorker}>
            Tenaga Kesehatan: <Text style={styles.boldText}>{healthWorker}</Text>
        </Text>
        <Text style={[styles.status, { color: statusColor }]}>Status: {status}</Text>

        <TouchableOpacity 
            style={[styles.button, !buttonEnabled && styles.buttonDisabled]} 
            disabled={!buttonEnabled}
        >
            <FontAwesome name="whatsapp" size={24} color={buttonEnabled ? "white" : "gray"} />
            <Text style={[styles.buttonText, !buttonEnabled && styles.buttonTextDisabled]}>
                {buttonEnabled ? "Button with Icon" : "Button with Icon disabled"}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 20,
    },
    notificationBox: {
        width: width * 0.9,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#04D1A1",
        backgroundColor: "#F9F9F9",
        marginVertical: 10,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        marginLeft: 10,
    },
    date: {
        fontSize: 14,
        color: "#888888",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
    },
    healthWorker: {
        fontSize: 14,
    },
    boldText: {
        fontWeight: "bold",
    },
    status: {
        fontSize: 14,
        marginVertical: 5,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: "#25D366",
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: "#E0E0E0",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        marginLeft: 10,
    },
    buttonTextDisabled: {
        color: "gray",
    },
});

export default NotificationScreen;
