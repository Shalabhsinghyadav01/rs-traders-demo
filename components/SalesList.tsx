import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import PaymentSettlementModal from './PaymentSettlementModal';

export default function SalesList() {
  const { sales, deleteSale } = useApp();
  const navigation = useNavigation();
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handleDelete = (saleId: string) => {
    Alert.alert(
      'Delete Sale',
      'Are you sure you want to delete this sale? This will revert inventory changes.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSale(saleId),
        },
      ]
    );
  };

  const handleGenerateBill = (saleId: string) => {
    navigation.navigate('Bill', { saleId });
  };

  const handleSettlePayment = (sale) => {
    setSelectedSale(sale);
    setShowPaymentModal(true);
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

  if (sales.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Sales</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('SalesList')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="chevron-right" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="point-of-sale" size={48} color="#94a3b8" />
          <Text style={styles.noSales}>No sales recorded yet</Text>
          <Text style={styles.noSalesSubtext}>Your recent sales will appear here</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Sales</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('SalesList')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="chevron-right" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {sales.slice(0, 5).map((sale) => (
        <View key={sale.id} style={styles.saleCard}>
          <View style={styles.saleHeader}>
            <View>
              <Text style={styles.invoiceNumber}>Invoice #{sale.invoiceNumber}</Text>
              <Text style={styles.date}>{formatDate(sale.createdAt)}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getPaymentStatusColor(sale.paymentStatus).bg }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getPaymentStatusColor(sale.paymentStatus).text }
              ]}>
                {sale.paymentStatus}
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
              {sale.paymentStatus !== 'paid' && (
                <Text style={styles.remainingAmount}>
                  Remaining: {formatCurrency(sale.totalAmount - (sale.paidAmount || 0))}
                </Text>
              )}
            </View>

            <View style={styles.actionButtons}>
              {sale.paymentStatus !== 'paid' && (
                <TouchableOpacity
                  style={styles.settleButton}
                  onPress={() => handleSettlePayment(sale)}
                >
                  <MaterialIcons name="payment" size={18} color="#fff" />
                  <Text style={styles.settleButtonText}>Settle</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => handleGenerateBill(sale.id)}
              >
                <MaterialIcons name="receipt" size={18} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Bill</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(sale.id)}
              >
                <MaterialIcons name="delete-outline" size={18} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {selectedSale && (
        <PaymentSettlementModal
          visible={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedSale(null);
          }}
          sale={selectedSale}
        />
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f610',
    borderRadius: 8,
  },
  viewAllText: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    gap: 12,
  },
  noSales: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  noSalesSubtext: {
    fontSize: 14,
    color: '#94a3b8',
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
  remainingAmount: {
    fontSize: 13,
    color: '#e67e22',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settleButton: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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