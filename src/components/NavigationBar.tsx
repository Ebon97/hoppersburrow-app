import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../constants/color';

const tabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Rentals', icon: 'shopping-bag' },
  { label: 'Transactions', icon: 'credit-card' },
  { label: 'Account', icon: 'user' },
];

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.label === activeTab;
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.label)}
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
    backgroundColor: '#fff', // <== Transparent white
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