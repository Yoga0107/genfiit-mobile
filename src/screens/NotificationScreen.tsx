import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
} from "react-native";
import ResponsiveContainer from "../components/ResponsiveContainer";
import HeaderComponent from "../components/Header";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { getIDuserdetail, getToken } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";
import { generateWhatsAppMessage } from "../helper/WhatsappMessage";

const { width } = Dimensions.get("window");

interface Notification {
    id: number;
    name: string;
    category: string;
    createdAt: string;
    status: string; // Status: "in_progress" atau "done"
    dob: number | null; // DOB dalam epoch time (timestamp)
    consultant: {
        name: string;
        job_title: string;
        schedule: string;
    } | null;
}

const NotificationScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Fungsi untuk mendapatkan notifikasi
    const fetchNotifications = async () => {
        try {
            const token = await getToken();
            let id = await getID();
    
            if (!id || isNaN(Number(id))) {
                // Jika ID tidak ditemukan, gunakan getIDuserdetail
                id = await getIDuserdetail();
                if (!id || isNaN(Number(id))) {
                    throw new Error("Invalid user ID");
                }
            }
    
            setUserId(Number(id));
    
            const response = await fetch(
                `https://api-genfiit.yanginibeda.web.id/api/telehealths?filters[users_permissions_user][id][$eq]=${id}&populate=*`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error(`Error fetching notifications: ${response.statusText}`);
            }
    
            const json = await response.json();
    
            // Check the response data to ensure dob is available and properly converted
            console.log("Response data:", json);
    
            const formattedData = json.data.map((item: any) => ({
                id: item.id,
                name: item.attributes.user.name,
                category: item.attributes.category,
                createdAt: item.attributes.createdAt,
                status: item.attributes.status,
                dob: item.attributes.user.dob
                    ? new Date(Number(item.attributes.user.dob) * 1000).getTime() // Convert epoch to milliseconds
                    : null,
                consultant: item.attributes.consultant?.data
                    ? {
                          name: item.attributes.consultant.data.attributes.name,
                          job_title: item.attributes.consultant.data.attributes.job_title,
                          schedule: item.attributes.consultant.data.attributes.schedule,
                      }
                    : null,
            }));
    
            setNotifications(formattedData);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            Alert.alert("Error", "Gagal memuat data konsultasi.");
        } finally {
            setLoading(false);
        }
    };

    // Gunakan efek untuk memuat notifikasi secara berkala
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fungsi refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    // Fungsi untuk membuka WhatsApp dengan pesan terformat
    const openWhatsApp = (
        name: string,
        category: string,
        dob?: number, // dob as epoch timestamp for consultation date
        consultantName?: string
    ) => {
        console.log("DOB passed:", dob);  // Check if dob is passed correctly
        const bodyMessage = generateWhatsAppMessage(
            name,
            category,
            consultantName,
            dob // Ensure dob is being passed correctly
        );
        const url = `https://wa.me/628128470419?text=${encodeURIComponent(bodyMessage)}`;
    
        Linking.openURL(url).catch(() =>
            Alert.alert("Error", "Tidak dapat membuka WhatsApp")
        );
    };
    

    // Komponen untuk merender tiap notifikasi
    const renderNotification = ({ item }: { item: Notification }) => (
        <NotificationBox
            name={item.name}
            category={item.category}
            createdAt={new Date(item.createdAt).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            })}
            status={item.status}
            onChatPress={() =>
                openWhatsApp(
                    item.name,
                    item.category,
                    item.dob ?? undefined,
                    item.consultant?.name
                )
            }
            consultant={item.consultant}
        />
    );

    // Tampilan loading
    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }


    // Tampilan utama
    return (
        <ResponsiveContainer>
            <HeaderComponent title="Notification" />
            <View style={styles.container}>
                {notifications.length === 0 ? (
                    <Text style={styles.emptyText}>There is no notification!</Text>
                ) : (
                    <FlatList
                        data={notifications}
                        renderItem={renderNotification}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                )}
            </View>
        </ResponsiveContainer>
    );
};

interface NotificationBoxProps {
    name: string;
    category: string;
    createdAt: string;
    status: string;
    onChatPress: () => void;
    consultant: {
        name: string;
        job_title: string;
        schedule: string;
    } | null;
}

// Komponen untuk kotak notifikasi
const NotificationBox: React.FC<NotificationBoxProps> = ({
    name,
    category,
    createdAt,
    status,
    onChatPress,
    consultant,
}) => (
    <View style={styles.notificationBox}>
        <View style={styles.header}>
            <FontAwesome name="user-circle-o" size={24} color="#04D1A1" />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.date}>
                    <MaterialIcons name="date-range" size={16} color="#888" /> {createdAt}
                </Text>
            </View>
            <Text
                style={[
                    styles.statusBadge,
                    status === "in_progress" ? styles.inProgress : styles.done,
                ]}
            >
                {status === "in_progress" ? "Sedang Berjalan" : "Selesai"}
            </Text>
        </View>

        <Text style={styles.subtitle}>
            <MaterialIcons name="category" size={16} color="#555" />{" "}
            {category === "gizi"
                ? "KONSULTASI GIZI"
                : category === "mental_health"
                    ? "KONSULTASI MENTAL HEALTH"
                    : "Kategori Tidak Dikenal"}
        </Text>

        {consultant && (
            <View style={styles.consultantContainer}>
                <FontAwesome name="user-md" size={20} color="#04D1A1" />
                <Text style={styles.consultantText}>
                    {consultant.name} - {consultant.job_title}
                </Text>
            </View>
        )}

        <TouchableOpacity
            style={[
                styles.chatButton,
                status === "done" && styles.chatButtonDisabled,
            ]}
            onPress={status === "in_progress" ? onChatPress : undefined}
            disabled={status === "done"}
        >
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>
                {status === "in_progress" ? "Chat via WhatsApp" : "Tidak Tersedia"}
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
    loadingText: {
        fontSize: 16,
        color: "#888",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
    list: {
        paddingBottom: 20,
    },
    notificationBox: {
        width: width * 0.9,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        marginVertical: 10,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: "bold",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
        textTransform: "uppercase",
    },
    inProgress: {
        backgroundColor: "#FFCC00",
        color: "#FFF",
    },
    done: {
        backgroundColor: "#04D1A1",
        color: "#FFF",
    },
    chatButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1abc9c",
        borderRadius: 5,
        padding: 10,
    },
    chatButtonDisabled: {
        backgroundColor: "#A9A9A9",
    },
    chatButtonText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 10,
    },
    consultantContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    consultantText: {
        fontSize: 14,
        color: "#555",
        marginLeft: 10,
        fontWeight: 'bold',
        marginBottom: 10
    },
    consultantLabel: {
        fontWeight: "bold",
        color: "#333",
    },
});

export default NotificationScreen