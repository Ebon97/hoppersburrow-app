import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AccommodationCard from '../../components/AccommodationCard';

const RentalListing = () => {
  const navigation = useNavigation();

  const activeRentals = [
    {
      id: 1,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 Jan 2025 - 31 Dec 2025, 6 month left',
      image: require('../assets/room1.jpg'),
      nextBillDate: '11 May 2025',
      isActive: true,
    },
  ];

  const pastRentals = [
    {
      id: 2,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 Aug 2022 - 30 Aug 2023, 1 year',
      image: require('../assets/room2.jpg'),
    },
    {
      id: 3,
      name: 'Room Name',
      address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
      dateRange: '1 June 2021 - 31 Dec 2021, 6 months',
      image: require('../assets/room3.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={20} color="#007AFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Rentals</Text>

      <Text style={styles.sectionTitle}>Active Rentals</Text>
      {activeRentals.map((rental) => (
        <View key={rental.id} style={styles.cardContainer}>
          <AccommodationCard
            image={rental.image}
            title={rental.name}
            address={rental.address}
            dateRange={rental.dateRange}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topupButton}>
              <Text style={styles.buttonText}>Top Up</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.billNote}>Next Bill Date: {rental.nextBillDate}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Past Rentals</Text>
      {pastRentals.map((rental) => (
        <View key={rental.id} style={styles.cardContainer}>
          <AccommodationCard
            image={rental.image}
            title={rental.name}
            address={rental.address}
            dateRange={rental.dateRange}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default RentalListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  payButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  topupButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  billNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
});
