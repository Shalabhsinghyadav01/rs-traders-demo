import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Product, Sale, SaleItem } from '../types';
import { generateInvoiceNumber } from '../utils/helpers';
import { toast } from 'sonner-native';

interface SalesFormProps {
  products: Product[];
  onSaleComplete: (sale: Sale) => void;
}

export default function SalesForm({ products, onSaleComplete }: SalesFormProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  
  const addItem = () => {
    setSelectedItems([...selectedItems, {
      productId: '',
      quantity: 0,
      price: 0,
      hsnCode: '',
      productName: ''
    }]);
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    const newItems = [...selectedItems];
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productId: product.id,
          price: product.price,
          hsnCode: product.hsnCode,
          productName: product.name
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setSelectedItems(newItems);
  };

  const calculateTaxes = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isIntraState = placeOfSupply === 'Karnataka'; // Replace with your state
    const cgst = isIntraState ? subtotal * 0.09 : 0;
    const sgst = isIntraState ? subtotal * 0.09 : 0;
    const igst = !isIntraState ? subtotal * 0.18 : 0;
    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  };

  const handleSubmit = () => {
    if (!buyerName || !buyerGstin || !placeOfSupply || selectedItems.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const { subtotal, cgst, sgst, igst, total } = calculateTaxes();
    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      buyerName,
      buyerGstin,
      placeOfSupply,
      items: selectedItems,
      totalAmount: total,
      cgst,
      sgst,
      igst,
      invoiceNumber: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      shippingAddress,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    onSaleComplete(sale);
    resetForm();
  };

  const resetForm = () => {
    setBuyerName('');
    setBuyerGstin('');
    setPlaceOfSupply('');
    setShippingAddress('');
    setSelectedItems([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Sale Entry</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Buyer Name *</Text>
        <TextInput
          style={styles.input}
          value={buyerName}
          onChangeText={setBuyerName}
          placeholder="Enter buyer name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>GSTIN *</Text>
        <TextInput
          style={styles.input}
          value={buyerGstin}
          onChangeText={setBuyerGstin}
          placeholder="Enter GSTIN"
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Place of Supply *</Text>
        <TextInput
          style={styles.input}
          value={placeOfSupply}
          onChangeText={setPlaceOfSupply}
          placeholder="Enter state"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Shipping Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Enter shipping address"
          multiline
          numberOfLines={3}
        />
      </View>

      <Text style={styles.subtitle}>Products</Text>
      {selectedItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product</Text>
            <Picker
              selectedValue={item.productId}
              onValueChange={(value) => updateItem(index, 'productId', value)}
            >
              <Picker.Item label="Select a product" value="" />
              {products.map((product) => (
                <Picker.Item
                  key={product.id}
                  label={`${product.name} (₹${product.price})`}
                  value={product.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={item.quantity.toString()}
              onChangeText={(value) => updateItem(index, 'quantity', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>

      {selectedItems.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Summary</Text>
          <Text>Subtotal: ₹{calculateTaxes().subtotal}</Text>
          <Text>CGST (9%): ₹{calculateTaxes().cgst}</Text>
          <Text>SGST (9%): ₹{calculateTaxes().sgst}</Text>
          <Text>IGST (18%): ₹{calculateTaxes().igst}</Text>
          <Text style={styles.total}>Total: ₹{calculateTaxes().total}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Sale</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 