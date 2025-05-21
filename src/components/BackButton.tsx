import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import COLORS from '../constants/color';

const BackButton = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.container, { top: insets.top + 8 }]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Feather name="chevron-left" size={20} color={COLORS.text} />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 4,
  },
});
