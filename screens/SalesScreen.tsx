import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SalesForm from '../components/SalesForm';
import Invoice from '../components/Invoice';
import { Sale } from '../types';
import { toast } from 'sonner-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

// Sample company details - replace with your actual company details
const companyDetails = {
  name: 'RS Traders',
  address: '123 Trading Street, Market Area, Bangalore - 560001',
  gstin: '29ABCDE1234F1Z5',
  logo: 'https://via.placeholder.com/150', // Replace with your actual logo URL
};

export default function SalesScreen() {
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { products, addSale } = useApp();
  const navigation = useNavigation();

  const handleSaleComplete = (sale: Sale) => {
    setCurrentSale(sale);
    setShowInvoice(true);
    addSale(sale);
    toast.success('Sale completed successfully!');
  };

  const handleNewSale = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showInvoice ? (
        <SalesForm
          products={products}
          onSaleComplete={handleSaleComplete}
        />
      ) : (
        <View style={styles.invoiceContainer}>
          <Invoice sale={currentSale!} companyDetails={companyDetails} />
          <TouchableOpacity style={styles.newSaleButton} onPress={handleNewSale}>
            <Text style={styles.newSaleButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  invoiceContainer: {
    flex: 1,
  },
  newSaleButton: {
    backgroundColor: '#3498db',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newSaleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 