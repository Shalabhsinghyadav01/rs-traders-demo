import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { mockCustomers, mockInventoryData, states } from '../data/mockData';
import { toast } from 'sonner-native';

export default function SalesEntry({ onSaleComplete }) {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');

  const calculateGST = (baseAmount: number, buyerState: string) => {
    const sellerState = 'Karnataka'; // Assuming company is in Karnataka
    const gstRate = 0.18; // 18% GST
    const totalGST = baseAmount * gstRate;

    if (buyerState === sellerState) {
      return {
        cgst: totalGST / 2,
        sgst: totalGST / 2,
        igst: 0
      };
    }
    return {
      cgst: 0,
      sgst: 0,
      igst: totalGST
    };
  };

  const handleSubmit = () => {
    if (!selectedCustomer || !selectedProduct || !quantity || !placeOfSupply) {
      toast.error('Please fill all fields');
      return;
    }

    const product = mockInventoryData.find(p => p.sku === selectedProduct);
    const customer = mockCustomers.find(c => c.gstin === selectedCustomer);
    
    if (!product || !customer) {
      toast.error('Invalid product or customer selection');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantityNum > product.quantity) {
      toast.error('Insufficient stock');
      return;
    }

    const baseAmount = product.price * quantityNum;
    const gst = calculateGST(baseAmount, customer.state);
    const totalAmount = baseAmount + gst.cgst + gst.sgst + gst.igst;

    const saleData = {
      customer,
      product,
      quantity: quantityNum,
      baseAmount,
      gst,
      totalAmount,
      placeOfSupply,
      date: new Date(),
    };

    onSaleComplete(saleData);
    toast.success('Sale recorded successfully');

    // Reset form
    setSelectedCustomer('');
    setSelectedProduct('');
    setQuantity('');
    setPlaceOfSupply('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>New Sale Entry</Text>
      
      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer GSTIN</Text>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={setSelectedCustomer}
            style={styles.picker}
          >
            <Picker.Item label="Select Customer" value="" />
            {mockCustomers.map(customer => (
              <Picker.Item 
                key={customer.gstin} 
                label={`${customer.name} (${customer.gstin})`} 
                value={customer.gstin} 
              />
            ))}
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product</Text>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={setSelectedProduct}
            style={styles.picker}
          >
            <Picker.Item label="Select Product" value="" />
            {mockInventoryData.map(product => (
              <Picker.Item 
                key={product.sku} 
                label={`${product.name} (₹${product.price})`} 
                value={product.sku} 
              />
            ))}
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Place of Supply</Text>
          <Picker
            selectedValue={placeOfSupply}
            onValueChange={setPlaceOfSupply}
            style={styles.picker}
          >
            <Picker.Item label="Select State" value="" />
            {states.map(state => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Record Sale</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  form: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4c6ef5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});