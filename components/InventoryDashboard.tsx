import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function InventoryDashboard() {
  const { products } = useApp();
  const navigation = useNavigation();

  // Calculate inventory stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity < 100).length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: 'category',
      color: '#3498db',
    },
    {
      title: 'Total Items',
      value: totalItems.toString(),
      icon: 'inventory-2',
      color: '#27ae60',
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.toString(),
      icon: 'warning',
      color: '#e74c3c',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(totalValue),
      icon: 'account-balance-wallet',
      color: '#f39c12',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Overview</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Inventory')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#3498db" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View 
            key={index}
            style={[styles.statCard, { backgroundColor: `${stat.color}10` }]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{stat.title}</Text>
              <Text style={[styles.cardValue, { color: stat.color }]}>{stat.value}</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: stat.color }]}>
              <MaterialIcons name={stat.icon} size={20} color="#fff" />
            </View>
          </View>
        ))}
      </View>

      {products.length > 0 && (
        <View style={styles.recentProducts}>
          <Text style={styles.sectionTitle}>Recent Products</Text>
          {products.slice(0, 3).map(product => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productSku}>SKU: {product.sku}</Text>
                </View>
                <View style={[
                  styles.stockBadge,
                  { backgroundColor: product.quantity < 100 ? '#fee2e2' : '#dcfce7' }
                ]}>
                  <Text style={[
                    styles.stockText,
                    { color: product.quantity < 100 ? '#ef4444' : '#16a34a' }
                  ]}>
                    {product.quantity < 100 ? 'Low Stock' : 'In Stock'}
                  </Text>
                </View>
              </View>

              <View style={styles.productFooter}>
                <View style={styles.productStat}>
                  <Text style={styles.statLabel}>Quantity</Text>
                  <Text style={styles.statNumber}>{product.quantity}</Text>
                </View>
                <View style={styles.productStat}>
                  <Text style={styles.statLabel}>Price</Text>
                  <Text style={styles.statNumber}>{formatCurrency(product.price)}</Text>
                </View>
                <View style={styles.productStat}>
                  <Text style={styles.statLabel}>Value</Text>
                  <Text style={styles.statNumber}>
                    {formatCurrency(product.quantity * product.price)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#3498db',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  recentProducts: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  productSku: {
    fontSize: 12,
    color: '#64748b',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  productStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});