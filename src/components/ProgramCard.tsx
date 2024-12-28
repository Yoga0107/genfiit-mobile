import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getToken } from '../utils/handlingDataLogin'; // Pastikan getToken sudah tersedia
import { getID } from '../utils/handlingDataRegister'; // Pastikan getID sudah tersedia

interface Report {
  id: number;
  is_complete: boolean;
  material_slug: string;
  material_uuid: string;
  uuid: string;
}

interface ProgramCardProps {
  completed: number;
  total: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ completed, total }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.completed}>{completed}</Text>
      <Text style={styles.programText}>Program Selesai</Text>
      <Text style={styles.total}>{completed} / {total} Program</Text>
    </View>
  );
};

const ProgramCardWithData: React.FC = () => {
  const [completed, setCompleted] = useState(0); // Untuk menyimpan jumlah yang selesai
  const [total, setTotal] = useState(0); // Untuk menyimpan total UUID (jumlah laporan)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken(); // Ambil token
        const userId = await getID(); // Ambil User ID
    
        console.log('Token:', token);
        console.log('User ID:', userId);
    
        if (!token || !userId) {
          console.error('Token or user ID not available');
          return;
        }
    
        // Fetch data dari API
        const response = await fetch(`https://api-genfiit.yanginibeda.web.id/api/users/${userId}?populate=reports`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('API Response Error:', errorMessage);
          throw new Error(`Failed to fetch data: ${response.status} ${errorMessage}`);
        }
    
        const data = await response.json();
        console.log('Full API response:', data); // Menampilkan keseluruhan respons
    
        // Memeriksa apakah 'data.data.reports' ada
        if (!data?.data?.reports) {
          console.error('Laporan tidak ditemukan dalam respons.');
          return;
        }
    
        // Memeriksa apakah data.data.reports ada dan bukan null atau undefined
        const reportsArray: any[] = data?.data?.reports || [];
        if (!Array.isArray(reportsArray)) {
          console.error('Reports tidak berbentuk array. Periksa struktur respons API.');
          return;
        }
    
        console.log('Reports array:', reportsArray); // Log array reports
    
        // Mengambil dan menghitung UUID yang terambil
        const uuids = reportsArray.map(report => report.uuid).filter(Boolean); // Hanya mengambil UUID yang ada
        const totalUUIDs = uuids.length; // Jumlah UUID yang terambil
        console.log('Total UUID yang terambil:', totalUUIDs);
    
        // Menghitung jumlah laporan yang selesai
        const completedReports = reportsArray.filter(report => report.is_complete).length;
        console.log('Jumlah laporan selesai:', completedReports);
    
        // Update jumlah laporan yang selesai ke state
        setCompleted(completedReports);
        setTotal(totalUUIDs); // Update jumlah total laporan
    
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData(); // Panggil fungsi fetch data
  }, []);

  return <ProgramCard completed={completed} total={total} />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    width: '45%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  completed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009688',
  },
  programText: {
    fontSize: 16,
    color: '#666',
  },
  total: {
    fontSize: 14,
    color: '#444',
  },
});

export default ProgramCardWithData;
