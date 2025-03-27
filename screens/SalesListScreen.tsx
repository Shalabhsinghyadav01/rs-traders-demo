import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function SalesListScreen() {
  const navigation = useNavigation();
  const { sales, deleteSale } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: '#dcfce7', text: '#166534' };
      case 'partial':
        return { bg: '#fef9c3', text: '#854d0e' };
      case 'pending':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const filteredSales = sales
    .filter(sale => {
      const searchLower = searchQuery.toLowerCase();
      return (
        sale.buyerName.toLowerCase().includes(searchLower) ||
        sale.invoiceNumber.toLowerCase().includes(searchLower) ||
        sale.items.some(item => item.productName.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return sortOrder === 'desc'
          ? b.totalAmount - a.totalAmount
          : a.totalAmount - b.totalAmount;
      }
    });

  const toggleSort = (type: 'date' | 'amount') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>All Sales</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer, invoice, or product"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Sort Options */}
        <View style={styles.sortOptions}>
          <TouchableOpacity 
            style={[
              styles.sortButton,
              sortBy === 'date' && styles.sortButtonActive
            ]}
            onPress={() => toggleSort('date')}
          >
            <Text style={[
              styles.sortButtonText,
              sortBy === 'date' && styles.sortButtonTextActive
            ]}>
              Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sortButton,
              sortBy === 'amount' && styles.sortButtonActive
            ]}
            onPress={() => toggleSort('amount')}
          >
            <Text style={[
              styles.sortButtonText,
              sortBy === 'amount' && styles.sortButtonTextActive
            ]}>
              Amount {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sales List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredSales.map((sale) => (
          <View key={sale.id} style={styles.saleCard}>
            <View style={styles.saleHeader}>
              <View>
                <Text style={styles.invoiceNumber}>Invoice #{sale.invoiceNumber}</Text>
                <Text style={styles.date}>{formatDate(sale.createdAt)}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getPaymentStatusColor(sale.paymentStatus || 'pending').bg }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getPaymentStatusColor(sale.paymentStatus || 'pending').text }
                ]}>
                  {sale.paymentStatus || 'Pending'}
                </Text>
              </View>
            </View>

            <View style={styles.customerSection}>
              <MaterialIcons name="person" size={16} color="#64748b" />
              <Text style={styles.buyerName}>{sale.buyerName}</Text>
            </View>

            <View style={styles.itemsList}>
              {sale.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                    <Text style={styles.itemAmount}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>
                  {formatCurrency(sale.totalAmount)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => navigation.navigate('Bill', { saleId: sale.id })}
                >
                  <MaterialIcons name="receipt" size={18} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Bill</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      'Delete Sale',
                      'Are you sure you want to delete this sale? This will revert inventory changes.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => deleteSale(sale.id)
                        },
                      ]
                    );
                  }}
                >
                  <MaterialIcons name="delete-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  sortButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  saleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  buyerName: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  itemsList: {
    gap: 8,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748b',
    minWidth: 32,
  },
  itemAmount: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    minWidth: 80,
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f766e',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
}); 