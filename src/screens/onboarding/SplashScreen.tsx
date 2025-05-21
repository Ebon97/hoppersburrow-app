import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import COLORS from '../../constants/color';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>HOPPERS & BURROWS</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 70,
  },
});
