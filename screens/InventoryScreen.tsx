import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import ProductList from '../components/ProductList';
import AddProductModal from '../components/AddProductModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function InventoryScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { products } = useApp();
  const navigation = useNavigation();

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity < 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.title}>Inventory Management</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Low Stock Alerts */}
        {getLowStockProducts().length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <MaterialIcons name="warning" size={20} color="#c2410c" />
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
            </View>
            {getLowStockProducts().map(product => (
              <Text key={product.id} style={styles.alertText}>
                • {product.name} - Only {product.quantity} units left
              </Text>
            ))}
          </View>
        )}

        {/* Product List */}
        <ProductList />

        {/* Add Product Modal */}
        <AddProductModal 
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    gap: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alertSection: {
    backgroundColor: '#ffedd5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c2410c',
  },
  alertText: {
    color: '#9a3412',
    marginBottom: 8,
    fontSize: 14,
  },
}); 