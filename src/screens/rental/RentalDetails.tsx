import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import BackHeader from '../../components/BackHeader';
import NavigationBar from '../../components/NavigationBar';
import Icon from 'react-native-vector-icons/Feather';

const RentalDetails = () => {
  const route = useRoute();
  const { id } = route.params;

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  const [visibleDocs, setVisibleDocs] = useState(3);
  const [visiblePayments, setVisiblePayments] = useState(3);

  useEffect(() => {
    const sampleData = {
        id,
        image: require('../../../assets/accommodation/room-1.jpg'),
        name: 'Sunset Villa Room',
        address: '111, Road Kuching, 93000, Kuching, Sarawak, Malaysia',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        bookingRef: 'ABC1234',
        status: 'active',
        tenant: 'John Doe',
        remarks: 'Billed on the 5th of each month',
        period: '1 year',
        contact: '+6012 345 6789',
        signedBy: 'Mary Johnson',
        documents: [
          {
            label: 'Rental Agreement',
            pdf: 'https://example.com/docs/rental-agreement.pdf',
          },
          {
            label: 'Deposit Payment Receipt',
            pdf: 'https://example.com/docs/deposit-receipt.pdf',
          },
        ],
        payments: [
          {
            label: 'Rental Payment - May 2025',
            pdf: 'https://example.com/payments/rent-may-2025.pdf',
          },
          {
            label: 'Electric Top-Up - RM 30',
            pdf: 'https://example.com/payments/electric-topup.pdf',
          },
          {
            label: 'Rental Payment - April 2025',
            pdf: 'https://example.com/payments/rent-april-2025.pdf',
          },
          {
            label: 'Penalty for Air-Conditioner Repair',
            pdf: 'https://example.com/payments/penalty-ac-repair.pdf',
          },
        ],
      };
      setRental(sampleData);
      setLoading(false);
  }, [id]);

  const fetchRentalDetails = async () => {
    try {
      const response = await fetch(`https://your-api.com/api/rentals/${id}`);
      const data = await response.json();
      setRental(data);
    } catch (error) {
      console.error('Failed to fetch rental details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!rental) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Rental not found.</Text>
      </SafeAreaView>
    );
  }

  const isPastEndDate = new Date(rental.endDate) > new Date();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackHeader title={`Rental #${rental.bookingRef || id}`} />

        <Image source={rental.image} style={styles.image} />

        {/* Status Badge */}
        {rental.status === 'active' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.roomName}>{rental.name}</Text>
          <Text style={styles.address}>{rental.address}</Text>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={styles.dateValue}>
              {new Date(rental.startDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
         <View style={[styles.dateBox, isPastEndDate && styles.dateBoxGrey]}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>
            {new Date(rental.endDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Booking Reference</Text>
              <Text style={styles.gridValue}>{rental.bookingRef}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Renting Period</Text>
              <Text style={styles.gridValue}>{rental.period}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tenant</Text>
              <Text style={styles.gridValue}>{rental.tenant}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Contact Number</Text>
              <Text style={styles.gridValue}>{rental.contact}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Remarks</Text>
              <Text style={styles.gridValue}>{rental.remarks}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Signed Off By</Text>
              <Text style={styles.gridValue}>{rental.signedBy}</Text>
            </View>
          </View>
        </View>


       <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        {rental.documents.slice(0, visibleDocs).map((doc, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => Linking.openURL(doc.pdf)}
            style={styles.docRow}
          >
            <Icon name="file-text" size={16} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.linkItem}>{doc.label}</Text>
          </TouchableOpacity>
        ))}

        {visibleDocs < rental.documents.length && (
          <TouchableOpacity onPress={() => setVisibleDocs(visibleDocs + 3)} style={styles.showMore}>
            <Text style={styles.showMoreText}>Show More</Text>
          </TouchableOpacity>
        )}
      </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {rental.payments.slice(0, visiblePayments).map((doc, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(doc.pdf)}
              style={styles.docRow}
            >
              <Icon name="file-text" size={16} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.linkItem}>{doc.label}</Text>
            </TouchableOpacity>
          ))}

          {visiblePayments < rental.payments.length && (
            <TouchableOpacity onPress={() => setVisiblePayments(visiblePayments + 3)} style={styles.showMore}>
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
};

export default RentalDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    marginBottom: 10,
  },
  statusBadge: {
    position: 'absolute',
    right: 30,
    top: 75,
    backgroundColor: '#C4F0C2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 5,
  },
  statusText: {
    color: '#187A00',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat-Regular'
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'Montserrat-SemiBold',
  },
  address: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-Regular'
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dateBox: {
    backgroundColor: '#2C3E50',
    padding: 14,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  dateValue: {
    fontSize: 19,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  dateBoxGrey: {
    backgroundColor: '#999', // soft grey
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '46%',
    marginBottom: 16,
  },
  gridLabel: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Montserrat-Regular',
  },
  linkItem: {
    fontSize: 14,
    marginBottom: 0,
    color: '#444',
    fontFamily: 'Montserrat-Regular'
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  showMore: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  showMoreText: { 
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-SemiBold'
  },
});
