import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Sale } from '../types';
import { numberToWords } from '../utils/helpers';
import QRCode from 'react-native-qrcode-svg';

interface InvoiceProps {
  sale: Sale;
  companyDetails: {
    name: string;
    address: string;
    gstin: string;
    logo: string;
  };
}

export default function Invoice({ sale, companyDetails }: InvoiceProps) {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: companyDetails.logo }} style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyDetails.name}</Text>
            <Text style={styles.companyAddress}>{companyDetails.address}</Text>
            <Text style={styles.gstin}>GSTIN: {companyDetails.gstin}</Text>
          </View>
        </View>

        <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        <Text style={styles.invoiceNumber}>Invoice No: {sale.invoiceNumber}</Text>
        <Text style={styles.date}>Date: {new Date(sale.createdAt).toLocaleDateString()}</Text>

        {/* Buyer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.buyerName}>{sale.buyerName}</Text>
          <Text style={styles.buyerGstin}>GSTIN: {sale.buyerGstin}</Text>
          <Text style={styles.address}>{sale.shippingAddress}</Text>
          <Text style={styles.placeOfSupply}>Place of Supply: {sale.placeOfSupply}</Text>
        </View>

        {/* Products Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.flex2]}>Item</Text>
            <Text style={styles.tableCell}>HSN</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>

          {sale.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flex2]}>{item.productName}</Text>
              <Text style={styles.tableCell}>{item.hsnCode}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Tax Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(sale.totalAmount - sale.cgst - sale.sgst - sale.igst)}</Text>
          </View>
          {sale.cgst > 0 && (
            <View style={styles.summaryRow}>
              <Text>CGST (9%):</Text>
              <Text>{formatCurrency(sale.cgst)}</Text>
            </View>
          )}
          {sale.sgst > 0 && (
            <View style={styles.summaryRow}>
              <Text>SGST (9%):</Text>
              <Text>{formatCurrency(sale.sgst)}</Text>
            </View>
          )}
          {sale.igst > 0 && (
            <View style={styles.summaryRow}>
              <Text>IGST (18%):</Text>
              <Text>{formatCurrency(sale.igst)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(sale.totalAmount)}</Text>
          </View>
        </View>

        {/* Amount in Words */}
        <Text style={styles.amountInWords}>
          Amount in words: {numberToWords(sale.totalAmount)} Only
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.qrCode}>
            <QRCode
              value={`upi://pay?pa=your-upi-id@bank&pn=${companyDetails.name}&am=${sale.totalAmount}&tn=Invoice-${sale.invoiceNumber}`}
              size={100}
            />
          </View>
          <View style={styles.terms}>
            <Text style={styles.dueDate}>Due Date: {new Date(sale.dueDate).toLocaleDateString()}</Text>
            <Text style={styles.termsText}>Terms & Conditions Apply</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  companyAddress: {
    color: '#7f8c8d',
    marginVertical: 4,
  },
  gstin: {
    color: '#34495e',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
  invoiceNumber: {
    fontSize: 16,
    color: '#34495e',
  },
  date: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  buyerGstin: {
    color: '#34495e',
  },
  address: {
    color: '#7f8c8d',
    marginVertical: 4,
  },
  placeOfSupply: {
    color: '#34495e',
  },
  table: {
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  flex2: {
    flex: 2,
  },
  summary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#dee2e6',
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#dee2e6',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  amountInWords: {
    marginVertical: 20,
    fontStyle: 'italic',
    color: '#34495e',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#dee2e6',
  },
  qrCode: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  terms: {
    flex: 1,
    marginLeft: 20,
  },
  dueDate: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 8,
  },
  termsText: {
    color: '#7f8c8d',
    fontSize: 12,
  },
}); 