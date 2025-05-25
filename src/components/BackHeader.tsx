import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const BackHeader = ({ title, variant = 'light' }: { title: string; variant?: 'light' | 'dark' }) => {
  const navigation = useNavigation();
  const isDark = variant === 'dark';

  return (
    <View style={styles.header}>
      <View style={{ width: 25, alignItems: 'flex-start' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      </View>

      <View style={{ width: 25 }} />
    </View>
  );
};

export default BackHeader;


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
    fontFamily: 'Montserrat-Regular'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Montserrat-Bold'
  },
});
