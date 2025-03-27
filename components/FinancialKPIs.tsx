import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const formatCurrency = (value: number) => {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function FinancialKPIs() {
  const { sales, products, kpis } = useApp();

  // Calculate monthly stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthlySales.reduce((total, sale) => total + sale.totalAmount, 0);

  // Calculate EBITDA components
  const totalRevenue = kpis.totalRevenue;
  const costOfGoodsSold = sales.reduce((total, sale) => {
    return total + sale.items.reduce((itemTotal, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return itemTotal + (product.costPrice * item.quantity);
      }
      return itemTotal;
    }, 0);
  }, 0);

  // Operating expenses (assumed percentages for demonstration)
  const operatingExpenses = {
    salaries: totalRevenue * 0.05,        // 5% of revenue
    rent: totalRevenue * 0.02,            // 2% of revenue
    utilities: totalRevenue * 0.01,       // 1% of revenue
    marketing: totalRevenue * 0.02,       // 2% of revenue
    other: totalRevenue * 0.05,           // 5% of revenue
  };

  const totalOperatingExpenses = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);

  // Calculate EBITDA
  const ebitda = totalRevenue - costOfGoodsSold - totalOperatingExpenses;

  // Calculate Net Profit components
  const depreciation = totalRevenue * 0.03;  // Assuming 3% depreciation
  const interest = totalRevenue * 0.02;      // Assuming 2% interest expense
  const taxes = (ebitda - depreciation - interest) * 0.25; // Assuming 25% tax rate

  // Calculate Net Profit
  const netProfit = ebitda - depreciation - interest - taxes;

  // Calculate outstanding amount
  const outstandingAmount = sales
    .filter(sale => !sale.paymentStatus || sale.paymentStatus.toLowerCase() === 'pending')
    .reduce((total, sale) => total + sale.totalAmount, 0);

  const kpiData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      icon: 'payments',
      color: '#3498db',
      bgColor: '#ebf8ff',
    },
    {
      title: 'Profit & EBITDA',
      mainValue: formatCurrency(netProfit),
      subValue: formatCurrency(ebitda),
      mainLabel: 'Net Profit',
      subLabel: 'EBITDA',
      icon: 'trending-up',
      color: '#27ae60',
      bgColor: '#f0fff4',
    },
    {
      title: 'Outstanding',
      value: formatCurrency(outstandingAmount),
      icon: 'account-balance',
      color: '#e67e22',
      bgColor: '#fff5eb',
    },
    {
      title: 'Monthly Sales',
      value: formatCurrency(monthlyRevenue),
      icon: 'assessment',
      color: '#8e44ad',
      bgColor: '#faf5ff',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.grid}>
        {kpiData.map((kpi, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: kpi.bgColor }
            ]}
          >
            <MaterialIcons
              name={kpi.icon as any}
              size={20}
              color={kpi.color}
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>{kpi.title}</Text>
            {'value' in kpi ? (
              <Text style={[styles.cardValue, { color: kpi.color }]}>
                {kpi.value}
              </Text>
            ) : (
              <View style={styles.multiValueContainer}>
                <View style={styles.valueRow}>
                  <Text style={[styles.mainValue, { color: kpi.color }]}>
                    {kpi.mainValue}
                  </Text>
                  <Text style={styles.valueLabel}>{kpi.mainLabel}</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={[styles.subValue, { color: kpi.color }]}>
                    {kpi.subValue}
                  </Text>
                  <Text style={styles.valueLabel}>{kpi.subLabel}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    minWidth: '47%',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 8,
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
  multiValueContainer: {
    gap: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mainValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  subValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueLabel: {
    fontSize: 12,
    color: '#64748b',
  },
});