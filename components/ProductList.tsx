import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProductList() {
  const { products, updateInventory } = useApp();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');

  const handleUpdateStock = (productId: string) => {
    const quantity = parseInt(quantityToAdd);
    if (isNaN(quantity)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    updateInventory(productId, quantity, true);
    setEditingProduct(null);
    setQuantityToAdd('');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount}`;
  };

  return (
    <View style={styles.container}>
      {products.map(product => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          
          <View style={styles.productDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SKU:</Text>
              <Text style={styles.detailValue}>{product.sku}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>HSN:</Text>
              <Text style={styles.detailValue}>{product.hsnCode}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>{formatCurrency(product.price)}</Text>
              <Text style={styles.detailLabel}>Cost:</Text>
              <Text style={styles.detailValue}>{formatCurrency(product.costPrice)}</Text>
            </View>
          </View>

          <View style={styles.stockSection}>
            <Text style={styles.stockLabel}>
              Current Stock: 
              <Text style={[
                styles.stockValue,
                product.quantity < 100 ? styles.lowStock : styles.normalStock
              ]}>
                {' '}{product.quantity} units
              </Text>
            </Text>

            {editingProduct === product.id ? (
              <View style={styles.updateStock}>
                <TextInput
                  style={styles.input}
                  value={quantityToAdd}
                  onChangeText={setQuantityToAdd}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdateStock(product.id)}
                >
                  <MaterialIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addStockButton}
                onPress={() => setEditingProduct(product.id)}
              >
                <Text style={styles.addStockText}>Add Stock</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  productHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  productDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    minWidth: 45,
  },
  detailValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  stockSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  stockLabel: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 8,
  },
  stockValue: {
    fontWeight: '600',
  },
  normalStock: {
    color: '#059669',
  },
  lowStock: {
    color: '#dc2626',
  },
  updateStock: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStockButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addStockText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
}); 