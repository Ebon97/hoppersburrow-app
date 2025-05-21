import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import COLORS from '../../constants/color';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(30)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const subtitleAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(30)).current;

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
      Animated.timing(subtitleAnim, {
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
      <Animated.Image
        source={require('../../../assets/onboarding/welcome.png')}
        style={[styles.image, {
          opacity: fadeAnim,
          transform: [{ translateY: imageAnim }],
        }]}
      />

      <Animated.Text
        style={[styles.title, {
          opacity: fadeAnim,
          transform: [{ translateY: titleAnim }],
        }]}
      >
        Welcome
      </Animated.Text>

      <Animated.Text
        style={[styles.subtitle, {
          opacity: fadeAnim,
          transform: [{ translateY: subtitleAnim }],
        }]}
      >
        Your Smart Room,{'\n'}It’s just One Tap Away
      </Animated.Text>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: buttonAnim }],
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('IntroSlider')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  image: {
    height: 320,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.dark_blue_charcoal,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
