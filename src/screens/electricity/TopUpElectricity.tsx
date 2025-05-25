import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import BackHeader from '../../components/BackHeader';
import NavigationBar from '../../components/NavigationBar';

const TopUpElectricity = () => {
  const navigation = useNavigation();

  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpKwh, setTopUpKwh] = useState('');
  const isConfirmEnabled = topUpAmount !== '' && parseFloat(topUpAmount) > 0;

  const rental = {
    room_name: 'Room Name',
    address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
    current_meter: 250,
    meter_last_updated_at: '2025-02-18 16:00:00',
    last_top_up: 100,
    last_top_up_at: '2025-04-30 10:30:00',
    last_top_up_kwh: 1000,
  };

  const usageData = [
    { month: 'Jan', topup: 230, usage: 215 },
    { month: 'Feb', topup: 245, usage: 230 },
    { month: 'Mar', topup: 250, usage: 240 },
    { month: 'Apr', topup: 248, usage: 238 },
    { month: 'May', topup: 251, usage: 241 },
    { month: 'Jun', topup: 250, usage: 240 },
  ];

  const pastTopUps = [
    { amount: 100, date: '2025-01-21' },
    { amount: 100, date: '2025-01-28' },
    { amount: 100, date: '2025-02-07' },
  ];

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#455A64" />
      <SafeAreaView style={{ flex: 0, backgroundColor: '#455A64' }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.heroHeader}>
            <BackHeader title="Top Up Electricity" variant="dark" />

            <View style={styles.roomInfoWrapper}>
              <Text style={styles.roomTitleDark}>Room Name</Text>
              <Text style={styles.roomAddressDark}>{rental.address}</Text>
            </View>
          </View>

          <View style={styles.meterCard}>
            <View style={styles.meterColumn}>
              <Text style={styles.label}>Current Meter</Text>
              <Text style={styles.meterValue}>{rental.current_meter} kwh</Text>
              <Text style={styles.meterInfo}>
                {formatDateTime(rental.meter_last_updated_at)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.meterColumn}>
              <Text style={styles.label}>Last Top Up</Text>
              <Text style={styles.meterValue}>RM {rental.last_top_up}</Text>
              <Text style={styles.meterInfo}>
                {formatDateTime(rental.last_top_up_at)}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>How much you want to top up ?</Text>

          <View style={styles.topUpRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefix}>RM</Text>
              <TextInput
                value={topUpAmount}
                onChangeText={(val) => {
                  setTopUpAmount(val);
                  const numeric = parseFloat(val);
                  if (!isNaN(numeric)) {
                    setTopUpKwh((numeric * 10).toFixed(0)); // 1 RM = 10 kWh
                  } else {
                    setTopUpKwh('');
                  }
                }}
                style={styles.inputWithPrefix}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                value={topUpKwh}
                editable={false}
                selectTextOnFocus={false}
                style={styles.inputWithPrefix}
                placeholder="0"
              />
              <Text style={styles.suffix}>kWh</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !isConfirmEnabled && styles.confirmButtonDisabled,
              ]}
              disabled={!isConfirmEnabled}
              onPress={() => {
                // handle top-up confirmation
              }}
            >
              <Text
                style={styles.confirmButtonText}
                  onPress={() => {
                    navigation.navigate('TopUpPayment', {
                      amount: topUpAmount,
                      kwh: topUpKwh,
                      roomName: rental.room_name,
                      address: rental.address,
                    });
                  }}
                >
                  Confirm
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickButtonsRow}>
            {['10', '30', '50', '100'].map((val, idx) => {
              const kwh = parseInt(val) * 10; // example: 1 RM = 10 kWh
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickButton}
                  onPress={() => {
                    setTopUpAmount(val);
                    setTopUpKwh(kwh.toString());
                  }}
                >
                  <Text style={styles.quickButtonText}>RM {val}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Electricity Meter Usage</Text>

          <View style={[styles.usageGraph, { justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 12 }]}>
            {usageData.map((item, idx) => (
              <View key={idx} style={styles.graphItem}>
                <View style={styles.graphBarArea}>
                  <View style={styles.barGroup}>
                    <View style={[styles.bar, { height: item.topup / 2, backgroundColor: '#007bff' }]} />
                    <View style={[styles.bar, { height: item.usage / 2, backgroundColor: '#ff5c5c' }]} />
                  </View>
                </View>
                <Text style={styles.graphLabel} numberOfLines={1}>{item.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#007bff' }]} />
              <Text style={styles.legendText}>Top Up</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff5c5c' }]} />
              <Text style={styles.legendText}>Usage</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Past Records</Text>
          {pastTopUps.map((item, idx) => (
            <View key={idx} style={styles.recordItem}>
              <Icon name="zap" size={22} color="#555" style={styles.recordIcon} />

              <View style={styles.recordContent}>
                <View style={styles.recordTopRow}>
                  <Text style={styles.recordText}>Top up RM {item.amount}</Text>
                  <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
                </View>
                <Text style={styles.recordSubText}>+{item.amount * 10} kWh</Text>
              </View>
            </View>
          ))}

        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </>
  );
};

export default TopUpElectricity;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroHeader: {
    backgroundColor: '#455A64',
    // paddingTop: 20,
    paddingBottom: 32,
    marginHorizontal: -20,
    paddingHorizontal: 24,
  },
  roomInfoWrapper: {
    alignItems: 'center',
    marginTop: 10,
    height: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 12,
  },
  roomTitleDark: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginBottom: 5
  },
  roomAddressDark: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: '#ddd',
  },
  roomTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#111',
    marginTop: 8,
  },
  roomAddress: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
  },
  meterCard: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
    marginTop: -60, // 👈 lifts card up to overlap heroHeader
    marginHorizontal: 5,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meterColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#ccc',
    marginBottom: 10,
  },
  meterValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    color: '#fff',
  },
  meterInfo: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    width: 2,
    backgroundColor: '#5A6D75', // lighter for visual contrast
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 14,
  },
  topUpRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  topUpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 44,
  },
  prefix: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginRight: 4,
    color: '#333',
  },
  suffix: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginLeft: 4,
    color: '#333',
  },
  inputWithPrefix: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 4,
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 42,
  },
  quickButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: '#333',
  },
  usageGraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 30,
  },
  barGroup: {
    flexDirection: 'row',
    // gap: 1,
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  graphBarArea: {
    height: 120, // fixed space to contain all bar heights
    justifyContent: 'flex-end', // align bars to bottom
  },
  graphItem: {
    alignItems: 'center',
    width: 60,
  },
  bar: {
    width: 12,
    borderRadius: 4,
  },
  graphLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 20,
    marginTop: 5,
    marginBottom: 34,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordIcon: {
    marginTop: 4,
    marginRight: 10,
  },
  recordContent: {
    flex: 1,
    marginBottom: 6,
  },
  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  recordDate: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#777',
  },
  recordSubText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

});
