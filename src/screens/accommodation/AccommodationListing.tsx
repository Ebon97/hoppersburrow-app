import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';
import AccommodationCard from '../../components/AccommodationCard';
import NavigationBar from '../../components/NavigationBar';
import BackHeader from '../../components/BackHeader';

const PropertyListingScreen = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [pax, setPax] = useState('');

  const accommodations = [
    {
      id: 1,
      image: require('../../../assets/room.jpg'),
      title: 'Sunrise Studio Room',
      address: '111, Road Kuching 93600, Kuching, Sarawak, Malaysia',
      price: 900,
    },
    {
      id: 2,
      image: require('../../../assets/room.jpg'),
      title: 'Hillside Cozy Suite',
      address: '45, Jalan Bukit, 93350, Kuching, Sarawak',
      price: 1050,
    },
    {
      id: 3,
      image: require('../../../assets/room.jpg'),
      title: 'Urban Edge Loft',
      address: '23A, Cityview Ave, 93100, Kuching',
      price: 880,
    },
  ];

  const [roomTypeDropdownOpen, setRoomTypeDropdownOpen] = useState(false);
  const roomTypeOptions = ['Studio', 'Single Room', 'Shared Room'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <BackHeader title="Search a Room" />

        {/* Location Search */}
        <View style={styles.searchSection}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.searchInputContainer}>
            <Icon name="map-pin" size={16} color="#999" />
            <Text style={styles.searchInput}>Kuching, Sarawak, Malaysia</Text>
            <Icon name="sliders" size={16} color="#999" />
          </TouchableOpacity>

          {/* Filters */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 8 }}
            style={{ marginBottom: 0 }} // optional spacing
          >
            <View style={styles.filterBox}>
              <Icon name="dollar-sign" size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>RM 500 - 1000</Text>
            </View>
            <View style={styles.filterBox}>
              <Icon name="home" size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>Studio</Text>
            </View>
            <View style={styles.filterBox}>
              <Icon name="users" size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.filterText}>1 Pax</Text>
            </View>
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#333' }}>Search Results</Text>
          <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#666' }}>
            {accommodations.length} results
          </Text>
        </View>

        {accommodations.map((item) => (
         <AccommodationCard
            key={item.id}
            image={item.image}
            title={item.title}
            address={item.address}
            price={item.price}
            onPress={() => navigation.navigate('AccommodationDetails', { id: item.id })}
          />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
             <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Filters</Text>
              <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                <Icon name="x" size={16} color="#333" />
              </TouchableOpacity>
            </View>

              {/* Location */}
              <View style={styles.modalRow}>
                <View style={[styles.modalInput, styles.inputWithIcon]}>
                  <Icon name="map-pin" size={16} color="#999" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Location"
                    placeholderTextColor="#999"
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              {/* Budget */}
              <View style={styles.modalRow}>
                <View style={[styles.inputWithIcon, {marginRight: 8}]}>
                  <Icon name="dollar-sign" size={16} color="#999" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Min Budget"
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={minBudget}
                    onChangeText={setMinBudget}
                  />
                </View>

                <View style={styles.inputWithIcon}>
                  <Icon name="dollar-sign" size={16} color="#999" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Max Budget"
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={maxBudget}
                    onChangeText={setMaxBudget}
                  />
                </View>
              </View>

              {/* Room Type & Pax */}
              <View style={styles.modalRow}>
                <TouchableOpacity
                  style={[styles.modalInput]}
                  onPress={() => setRoomTypeDropdownOpen(!roomTypeDropdownOpen)}
                >
                  {/* Left icon */}
                  <Icon name="home" size={16} color="#999" style={{ marginRight: 8 }} />

                  {/* Dropdown text */}
                  <Text style={[styles.dropdownText, { flex: 1 }]}>
                    {roomType ? roomType : 'Room Type'}
                  </Text>

                  {/* Chevron */}
                  <Icon name="chevron-down" size={16} color="#333" />
                </TouchableOpacity>

                {roomTypeDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {roomTypeOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setRoomType(option);
                          setRoomTypeDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.modalRow}>
                <View style={styles.inputWithIcon}>
                  <Icon name="users" size={16} color="#999" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Pax"
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={pax}
                    onChangeText={setPax}
                  />
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default PropertyListingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#333',
  },
  searchSection: {
    marginBottom: 32,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 24,
  },

  modalTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#333',
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 44,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    fontSize: 14,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
    marginRight: 6,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    flex: 1,
    // marginRight: 8,
    height: 44,
  },
  inputIcon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#333',
  },
});

