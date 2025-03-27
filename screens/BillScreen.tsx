import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Invoice from '../components/Invoice';
import { useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

// Sample company details - replace with your actual company details
const companyDetails = {
  name: 'RS Traders',
  address: '123 Trading Street, Market Area, Bangalore - 560001',
  gstin: '29ABCDE1234F1Z5',
  logo: 'https://via.placeholder.com/150', // Replace with your actual logo URL
};

export default function BillScreen() {
  const route = useRoute();
  const { sales } = useApp();
  const saleId = route.params?.saleId;
  
  const sale = sales.find(s => s.id === saleId);

  if (!sale) {
    return null; // Or show an error message
  }

  return (
    <SafeAreaView style={styles.container}>
      <Invoice sale={sale} companyDetails={companyDetails} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 