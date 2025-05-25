import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AccommodationCard from '../../components/AccommodationCard';
import BackHeader from '../../components/BackHeader';
import NavigationBar from '../../components/NavigationBar';

const RentalListing = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('Active');

  const activeRentals = [
    {
      id: 1,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 Jan 2025 - 31 Dec 2025, 6 month left',
      image: require('../../../assets/accommodation/room-1.jpg'),
      nextBillDate: '11 May 2025',
      price: 'RM 900',
    },
  ];

  const pastRentals = [
    {
      id: 2,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 Aug 2022 - 30 Aug 2023, 1 year',
      image: require('../../../assets/accommodation/room-2.jpg'),
      price: 'RM 880',
    },
    {
      id: 3,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 June 2021 - 31 Dec 2021, 6 months',
      image: require('../../../assets/accommodation/room-3.jpg'),
      price: 'RM 750',
    },
  ];

  const renderRentals = () => {
    if (filter === 'Active') return activeRentals;
    if (filter === 'Past') return pastRentals;
    return []; // No upcoming data for now
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <View style={styles.container}>
<BackHeader title="Rentals" />

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {['Active', 'Upcoming', 'Past'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.pill, filter === tab && styles.activePill]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.pillText, filter === tab && styles.activePillText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listings */}
        {renderRentals().map((rental) => (
          <View key={rental.id} style={styles.cardContainer}>
           <AccommodationCard
              image={rental.image}
              title={rental.name}
              address={rental.address}
              price={rental.price}
              dateRange={rental.dateRange}
              nextBillDate={filter === 'Active' ? rental.nextBillDate : null}
              onPress={() => navigation.navigate('RentalDetails', { id: rental.id })}
            />
            {filter === 'Active' && (
              <>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.buttonText}>Pay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.topupButton}
                    onPress={() => navigation.navigate('TopUpElectricity', { rentalId: rental.id })}
                  >
                    <Text style={styles.buttonText}>Top Up</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}
        </View>
        
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
};

export default RentalListing;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
    marginBottom: 20,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  activePill: {
    backgroundColor: '#000',
    fontFamily: 'Montserrat-SemiBold',
  },
  pillText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
  },
  activePillText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  payButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  topupButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  billNote: {
    marginTop: 6,
    fontSize: 13,
    color: '#888',
  },
  nextBill: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
});
