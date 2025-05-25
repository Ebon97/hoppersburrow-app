import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../constants/color';

const tabs = [
  { label: 'Home', icon: 'home', screen: 'Home' },
  { label: 'Rentals', icon: 'shopping-bag', screen: 'RentalListing' },
  { label: 'Transactions', icon: 'credit-card', screen: 'TransactionScreen' },
  { label: 'Account', icon: 'user', screen: 'AccountScreen' },
];

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.screen;
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.screen)}
          >
            <Icon
              name={tab.icon}
              size={22}
              style={[
                styles.icon,
                { color: isActive ? COLORS.primary : '#999' },
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? COLORS.primary : '#999' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 12,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 11,
  },
});