import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Sale, Payment } from '../types';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner-native';

interface PaymentSettlementModalProps {
  visible: boolean;
  onClose: () => void;
  sale: Sale;
}

export default function PaymentSettlementModal({
  visible,
  onClose,
  sale,
}: PaymentSettlementModalProps) {
  const { updateSale } = useApp();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const remainingAmount = sale.totalAmount - sale.paidAmount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleSubmit = () => {
    const paymentAmount = parseFloat(amount);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (paymentAmount > remainingAmount) {
      toast.error('Payment amount cannot exceed the remaining balance');
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      amount: paymentAmount,
      date: new Date().toISOString(),
      method: paymentMethod,
      reference: reference || undefined,
      notes: notes || undefined,
    };

    const newPaidAmount = sale.paidAmount + paymentAmount;
    const newPaymentStatus = 
      newPaidAmount >= sale.totalAmount 
        ? 'paid' 
        : newPaidAmount > 0 
          ? 'partial' 
          : 'pending';

    const updatedSale: Sale = {
      ...sale,
      paidAmount: newPaidAmount,
      paymentStatus: newPaymentStatus,
      payments: [...sale.payments, newPayment],
    };

    updateSale(sale.id, updatedSale);
    toast.success('Payment recorded successfully');
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
          <View style={styles.header}>
            <Text style={styles.title}>Record Payment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Invoice #{sale.invoiceNumber}</Text>
              <Text style={styles.buyerName}>{sale.buyerName}</Text>
              <View style={styles.amountRow}>
                <Text style={styles.label}>Total Amount:</Text>
                <Text style={styles.amount}>{formatCurrency(sale.totalAmount)}</Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.label}>Remaining:</Text>
                <Text style={[styles.amount, styles.remaining]}>
                  {formatCurrency(remainingAmount)}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Amount</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Cash" value="cash" />
                  <Picker.Item label="UPI" value="upi" />
                  <Picker.Item label="Bank Transfer" value="bank_transfer" />
                  <Picker.Item label="Cheque" value="cheque" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reference Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={reference}
                onChangeText={setReference}
                placeholder="Enter reference number"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Record Payment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  remaining: {
    color: '#e67e22',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 