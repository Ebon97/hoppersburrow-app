import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import BackButton from '../../components/BackButton';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/color';

const PermissionScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(30)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const descAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(30)).current;

  const insets = useSafeAreaInsets();

  const handleGrantPermissions = async () => {
    try {
      const cameraStatus = await request(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
      );

      const photoStatus = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      );

      if (cameraStatus === RESULTS.GRANTED && photoStatus === RESULTS.GRANTED) {
        navigation.navigate('SignUp');
      } else {
        Alert.alert(
          'Permissions Needed',
          'Please grant both camera and gallery access to continue.'
        );
      }
    } catch (error) {
      console.warn('Permission error:', error);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.stagger(150, [
      Animated.timing(imageAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: imageAnim }],
          paddingTop: 40,
          paddingBottom: 12,
        }}
      >
        <Image
          source={require('../../../assets/onboarding/permission.png')}
          style={styles.image}
        />
      </Animated.View>

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: titleAnim }],
        }}
      >
        <Text style={styles.title}>Permissions</Text>
      </Animated.View>

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: descAnim }],
          paddingHorizontal: 16,
        }}
      >
        <Text style={styles.desc}>
          We need permission to access Bluetooth and Location to connect to your smart door lock.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGrantPermissions}
        >
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 260,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  desc: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.dark_blue_charcoal,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 24,
    marginTop: 60,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});