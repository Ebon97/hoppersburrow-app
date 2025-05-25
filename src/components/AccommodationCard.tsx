import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/color';

const AccommodationCard = ({ image, title, location, price, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.price}>
          RM {price}  <Text style={styles.perMonth}>/ per month</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AccommodationCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    height: 180,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  location: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginTop: 5,
    color: COLORS.red,
  },
  perMonth: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#666',
  },
});
