import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import InventoryDashboard from '../components/InventoryDashboard';
import FinancialKPIs from '../components/FinancialKPIs';
import BillingSection from '../components/BillingSection';
import SalesList from '../components/SalesList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#1e293b', '#3498db']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>RS Traders</Text>
              <Text style={styles.headerSubtitle}>Distribution Management</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.inventoryButton]}
              onPress={() => navigation.navigate('Inventory')}
            >
              <MaterialIcons name="inventory" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Inventory</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.saleButton]}
              onPress={() => navigation.navigate('Sales')}
            >
              <MaterialIcons name="point-of-sale" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>New Sale</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <FinancialKPIs />
          <InventoryDashboard />
          <SalesList />
          <BillingSection />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  inventoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  saleButton: {
    backgroundColor: '#27ae60',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
});