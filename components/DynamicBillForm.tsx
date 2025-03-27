import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Sale, SaleItem } from '../types';

interface DynamicBillFormProps {
  onSubmit: (sale: Sale) => void;
}

export default function DynamicBillForm({ onSubmit }: DynamicBillFormProps) {
  const { products } = useApp();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerGstin: '',
    placeOfSupply: '',
    shippingAddress: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  const calculateGST = (subtotal: number, placeOfSupply: string) => {
    const gstRate = 0.18; // 18% GST
    const gstAmount = subtotal * gstRate;

    if (placeOfSupply === 'Karnataka') {
      return {
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: 0,
      };
    } else {
      return {
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
      };
    }
  };

  const addItem = () => {
    if (items.length === 0) {
      setItems([{
        productId: '',
        quantity: 1,
        price: 0,
        hsnCode: '',
        productName: '',
      }]);
    } else {
      setItems([...items, {
        productId: '',
        quantity: 1,
        price: 0,
        hsnCode: '',
        productName: '',
      }]);
    }
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If productId is selected, update other fields
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productName: product.name,
          hsnCode: product.hsnCode,
          price: product.price,
        };
      }
    }

    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV${year}${month}${random}`;
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.buyerName || !formData.placeOfSupply || items.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and add at least one item');
      return;
    }

    // Validate items
    const invalidItems = items.some(item => !item.productId || item.quantity <= 0);
    if (invalidItems) {
      Alert.alert('Error', 'Please fill in all item details correctly');
      return;
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const { cgst, sgst, igst } = calculateGST(subtotal, formData.placeOfSupply);
    const totalAmount = subtotal + cgst + sgst + igst;

    // Create sale object
    const sale: Sale = {
      id: Date.now().toString(),
      ...formData,
      items,
      totalAmount,
      cgst,
      sgst,
      igst,
      invoiceNumber: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
    };

    onSubmit(sale);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Buyer Name *"
          value={formData.buyerName}
          onChangeText={(value) => setFormData({ ...formData, buyerName: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="GSTIN (Optional)"
          value={formData.buyerGstin}
          onChangeText={(value) => setFormData({ ...formData, buyerGstin: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Place of Supply *"
          value={formData.placeOfSupply}
          onChangeText={(value) => setFormData({ ...formData, placeOfSupply: value })}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Shipping Address"
          value={formData.shippingAddress}
          onChangeText={(value) => setFormData({ ...formData, shippingAddress: value })}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date"
          value={formData.dueDate}
          onChangeText={(value) => setFormData({ ...formData, dueDate: value })}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Items</Text>
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Item {index + 1}</Text>
              <TouchableOpacity onPress={() => removeItem(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Select Product"
              value={item.productName}
              onChangeText={(value) => updateItem(index, 'productName', value)}
              editable={false}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="Quantity"
                value={item.quantity.toString()}
                onChangeText={(value) => updateItem(index, 'quantity', parseInt(value) || 0)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="Price"
                value={item.price.toString()}
                onChangeText={(value) => updateItem(index, 'price', parseFloat(value) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Generate Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  removeButton: {
    color: '#e74c3c',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 