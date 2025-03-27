import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddProductModal({ visible, onClose }: AddProductModalProps) {
  const { addProduct } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    hsnCode: '',
    price: '',
    costPrice: '',
    quantity: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.name || !formData.sku || !formData.price || !formData.costPrice) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new product
    const newProduct = {
      id: Date.now().toString(), // Simple ID generation
      name: formData.name,
      sku: formData.sku,
      hsnCode: formData.hsnCode,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      quantity: parseInt(formData.quantity) || 0,
    };

    // Add product to context
    addProduct(newProduct);

    // Reset form and close modal
    setFormData({
      name: '',
      sku: '',
      hsnCode: '',
      price: '',
      costPrice: '',
      quantity: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Product</Text>
          
          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter product name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SKU *</Text>
              <TextInput
                style={styles.input}
                value={formData.sku}
                onChangeText={(value) => handleChange('sku', value)}
                placeholder="Enter SKU"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>HSN Code</Text>
              <TextInput
                style={styles.input}
                value={formData.hsnCode}
                onChangeText={(value) => handleChange('hsnCode', value)}
                placeholder="Enter HSN code"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Selling Price *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleChange('price', value)}
                placeholder="Enter selling price"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost Price *</Text>
              <TextInput
                style={styles.input}
                value={formData.costPrice}
                onChangeText={(value) => handleChange('costPrice', value)}
                placeholder="Enter cost price"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Stock</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(value) => handleChange('quantity', value)}
                placeholder="Enter initial stock quantity"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  form: {
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#27ae60',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 