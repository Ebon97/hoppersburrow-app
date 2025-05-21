import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../constants/color';
import NavigationBar from '../components/NavigationBar';
import AccomodationCard from '../components/AccomodationCard';
import LocationCard from '../components//LocationCard';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = () => {
  const navigation = useNavigation();
  const accomodations = [
    {
      id: 1,
      image: require('../../assets/room.jpg'),
      title: 'Sunrise Studio Room',
      location: '111, Road Kuching 93600, Kuching, Sarawak, Malaysia',
      price: 900,
    },
    {
      id: 2,
      image: require('../../assets/room.jpg'),
      title: 'Hillside Cozy Suite',
      location: '45, Jalan Bukit, 93350, Kuching, Sarawak',
      price: 1050,
    },
    {
      id: 3,
      image: require('../../assets/room.jpg'),
      title: 'Urban Edge Loft',
      location: '23A, Cityview Ave, 93100, Kuching',
      price: 880,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>My Current Location</Text>
            <Text style={styles.location}>Kuching, Sarawak, Malaysia</Text>
          </View>
          <View style={styles.profileCircle} />
        </View>

        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* First Row - 2 Buttons */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.featureButton, { backgroundColor: '#ACE5FF' }]}>
            <View style={styles.featureContent}>
              <View style={styles.featureTextWrapper}>
                <Text style={styles.featureTextLeft}>Find a Room{'\n'}For Rent</Text>
              </View>
              <View style={styles.imageWrapperFirst}>
                <Image
                  source={require('../../assets/icons/booking.jpg')}
                  style={styles.featureImage}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.featureButton, { backgroundColor: '#D9F2EE' }]}>
            <View style={styles.featureContent}>
              <View style={styles.featureTextWrapper}>
                <Text style={styles.featureTextLeft}>Become{'\n'}a Owner</Text>
              </View>
              <View style={styles.imageWrapperFirst}>
                <Image
                  source={require('../../assets/icons/owner.jpg')}
                  style={styles.featureImage}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Second Row - 3 Buttons */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.featureButtonThird, { backgroundColor: '#EDF7FF' }]}>
            <View style={styles.featureContent}>
              <View style={styles.featureTextWrapperSecond}>
                <Text style={styles.featureTextLeft}>My Room</Text>
              </View>
              <View style={styles.imageWrapperSecond}>
                <Image
                  source={require('../../assets/icons/room_single.jpg')}
                  style={styles.featureImage}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.featureButtonThird, { backgroundColor: '#FCEDD8' }]}>
            <View style={styles.featureContent}>
              <View style={styles.featureTextWrapperSecond}>
                <Text style={styles.featureTextLeft}>Payments{'\n'}& Bills</Text>
              </View>
              <View style={styles.imageWrapperSecond}>
                <Image
                  source={require('../../assets/icons/payments.jpg')}
                  style={styles.featureImage}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.featureButtonThird, { backgroundColor: '#BB9BCA' }]}>
            <View style={styles.featureContent}>
              <View style={styles.featureTextWrapperSecond}>
                <Text style={styles.featureTextLeft}>Feedbacks</Text>
              </View>
              <View style={styles.imageWrapperSecond}>
                <Image
                  source={require('../../assets/icons/feedback.jpg')}
                  style={styles.featureImage}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Accomodations</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AccomodationListing')}>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>

        {accomodations.map((item) => (
          <AccomodationCard
            key={item.id}
            image={item.image}
            title={item.title}
            location={item.location}
            price={item.price}
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Explore More Accomodations</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationScrollContainer}
        >
          <LocationCard label="MIRI" image={require('../../assets/locations/miri.jpg')} />
          <LocationCard label="BINTULU" image={require('../../assets/locations/bintulu.jpg')} />
          <LocationCard label="SIBU" image={require('../../assets/locations/sibu.jpg')} />
        </ScrollView>
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  locationLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  location: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: COLORS.text,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  featureButton: {
    width: '48%',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 40,
    backgroundColor: '#C6E8FF',
    overflow: 'hidden',
  },
  featureContent: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextWrapper: {
    position: 'absolute',
    top: -28,
    left: 0,
    zIndex: 3,
  },
  featureTextWrapperSecond: {
    position: 'absolute',
    top: -25,
    left: 0,
    zIndex: 3,
  },
  featureTextLeft: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: COLORS.text,
    zIndex: 3,
  },
  imageWrapperFirst: {
    position: 'absolute',
    bottom: -50,
    right: 0,
    left: 60,
    width: 100,
    height: 100,
    overflow: 'hidden', // ⬅️ important to contain oversized images
    borderRadius: 8, // optional: round off corners if needed
  },
  imageWrapperSecond: {
    position: 'absolute',
    bottom: -47,
    right: 0,
    left: 30,
    width: 70,
    height: 70,
    overflow: 'hidden', // ⬅️ important to contain oversized images
    borderRadius: 8, // optional: round off corners if needed
  },
  featureImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  featureButtonThird: {
    width: '31%',
    borderRadius: 10,
    paddingVertical: 35,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  featureImageRight: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  featureImageAbsolute: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 64,
    height: 64,
    resizeMode: 'contain',
    zIndex: 0, // ensures image is underneath text
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  seeMore: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: COLORS.dark_blue_charcoal,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 100,
  },
  locationScrollContainer: {
    paddingVertical: 18,
    paddingRight: 12,
    marginBottom: 30,
  },
});