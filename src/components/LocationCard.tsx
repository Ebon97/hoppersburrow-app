import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LocationCard = ({ label, image }) => {
  return (
    <View style={styles.card}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
          style={styles.gradient}
        >
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: 'flex-end', // ⬅️ add this to push text to bottom
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#fff',
    padding: 12,
  },
});