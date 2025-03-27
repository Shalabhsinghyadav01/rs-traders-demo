import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import DynamicBillForm from './DynamicBillForm';
import { Sale } from '../types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Color palette
const colors = {
  primary: {
    light: '#60a5fa',
    default: '#2563eb',
    dark: '#1d4ed8',
  },
  success: {
    light: '#34d399',
    default: '#059669',
    dark: '#047857',
  },
  warning: {
    light: '#fbbf24',
    default: '#d97706',
    dark: '#b45309',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

const { width } = Dimensions.get('window');

export default function BillingSection() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addSale, sales } = useApp();
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;
  const modalSlideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = (index: number) => {
    Animated.spring(buttonScaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(buttonScaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const handleModalClose = () => {
    Animated.timing(modalSlideAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.quad),
    }).start(() => setIsModalVisible(false));
  };

  const handleGenerateBill = (sale: Sale) => {
    addSale(sale);
    handleModalClose();
    navigation.navigate('Bill', { saleId: sale.id });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Get today's total billing amount
  const getTodaysBilling = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sales
      .filter(sale => {
        const saleDate = new Date(sale.createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
      })
      .reduce((total, sale) => total + sale.totalAmount, 0);
  };

  // Get pending bills count
  const getPendingBillsCount = () => {
    return sales.filter(sale => 
      !sale.paymentStatus || sale.paymentStatus.toLowerCase() === 'pending'
    ).length;
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ],
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Billing</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('SalesList')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="chevron-right" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <Animated.View 
          style={[
            styles.statCard,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <MaterialIcons name="today" size={20} color="#3b82f6" />
          <Text style={styles.statLabel}>Today's Billing</Text>
          <Text style={styles.statValue}>{formatCurrency(getTodaysBilling())}</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.statCard,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <MaterialIcons name="pending-actions" size={20} color="#f59e0b" />
          <Text style={styles.statLabel}>Pending Bills</Text>
          <Text style={styles.statValue}>{getPendingBillsCount()}</Text>
        </Animated.View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          activeOpacity={1}
          onPressIn={() => handlePressIn(0)}
          onPressOut={() => handlePressOut(0)}
          onPress={handleModalOpen}
        >
          <Animated.View 
            style={[
              styles.newBillButton,
              { transform: [{ scale: buttonScaleAnims[0] }] }
            ]}
          >
            <MaterialIcons name="receipt" size={20} color="white" />
            <Text style={styles.buttonText}>Generate New Bill</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={1}
          onPressIn={() => handlePressIn(1)}
          onPressOut={() => handlePressOut(1)}
          onPress={() => navigation.navigate('Sales')}
        >
          <Animated.View 
            style={[
              styles.quickBillButton,
              { transform: [{ scale: buttonScaleAnims[1] }] }
            ]}
          >
            <MaterialIcons name="flash-on" size={20} color="white" />
            <Text style={styles.buttonText}>Quick Bill</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[
            styles.modalContent,
            { transform: [{ translateX: modalSlideAnim }] }
          ]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={handleModalClose}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#1e293b" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Generate New Bill</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView 
              style={styles.modalScrollContent}
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <DynamicBillForm onSubmit={handleGenerateBill} />
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </Animated.View>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primary.default + '10',
    borderRadius: 8,
  },
  viewAllText: {
    color: colors.primary.default,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[500],
    letterSpacing: -0.3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[800],
    letterSpacing: -0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  newBillButton: {
    flex: 2,
    backgroundColor: colors.primary.default,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickBillButton: {
    flex: 1,
    backgroundColor: colors.success.default,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.success.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.gray[900] + '80',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
  },
  placeholder: {
    width: 40,
  },
  modalScrollContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 16,
  },
});