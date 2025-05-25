import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import BackHeader from '../../components/BackHeader';
import NavigationBar from '../../components/NavigationBar';

const PaymentConfirmation = ({ route, navigation }) => {
  const {
    amount,
    kwh,
    roomName,
    address,
    name,
    phone,
    email,
    paymentMethod,
  } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackHeader title="Payment Confirmation" />

        <View style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <View>
              <Text style={styles.amountLabel}>Amount</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amountValue}>RM {parseFloat(amount).toFixed(2)}</Text>
              <Text style={styles.kwh}>+{kwh} kWh</Text>
            </View>
          </View>

          <View style={styles.roomRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomInfo}>{roomName}</Text>
              <Text style={styles.address}>{address}</Text>
              <Text style={styles.roomInfo}>Electricity Top Up 250430</Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.statusText}>Successful</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.successText}>Your Payment is Successful !</Text>
          <View style={styles.detailsGrid}>
            <View>
              <Text style={styles.detailLabel}>Confirmation Code</Text>
              <Text style={styles.detailValue}>#ABC1234</Text>

              <Text style={styles.detailLabel}>Tenant</Text>
              <Text style={styles.detailValue}>{name}</Text>

              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{paymentMethod}</Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>Renting Period</Text>
              <Text style={styles.detailValue}>1 year</Text>

              <Text style={styles.detailLabel}>Contact Number</Text>
              <Text style={styles.detailValue}>{phone}</Text>

              <Text style={styles.detailLabel}>Current Meter</Text>
              <Text style={styles.detailValue}>{kwh} kWh</Text>
            </View>
          </View>
        </View>


        <TouchableOpacity style={styles.receiptButton} disabled>
          <Text style={styles.receiptButtonText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to My Transactions</Text>
        </TouchableOpacity>
      </ScrollView>
      <NavigationBar/>
    </SafeAreaView>
  );
};

export default PaymentConfirmation;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  amountCard: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  amountLabel: {
    marginTop: 12,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  amountValue: {
    color: '#fff',
    fontSize: 34,
    fontFamily: 'Montserrat-Bold',
  },
  kwh: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  roomInfo: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    marginTop: 6,
  },
  address: {
    color: '#bbb',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    marginBottom: 10,
  },
  successBadge: {
    marginTop: 8,
    backgroundColor: '#2ecc71',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  successText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    marginTop: 30,
    marginBottom: 30,
  },
  sectionBlock: {
    marginBottom: 50,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#777',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#111',
    marginBottom: 12,
  },
  receiptButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptButtonText: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#444',
  },
  backButton: {
    backgroundColor: '#2C3E50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
});