import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/color';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Smart Access',
    desc: 'Unlock your room with just your phone.',
    image: require('../../../assets/onboarding/intro1.png'),
  },
  {
    key: '2',
    title: 'Pay Utilities',
    desc: 'Easily top up your smart meter and manage bills.',
    image: require('../../../assets/onboarding/intro2.png'),
  },
  {
    key: '3',
    title: 'Stay Informed',
    desc: 'Get alerts and updates on your rental status.',
    image: require('../../../assets/onboarding/intro3.png'),
  },
];

const IntroSliderScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(30)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(20)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: contentAnim }],
        }}
      >
        <SwiperFlatList
          showPagination
          paginationActiveColor={COLORS.dark_blue_charcoal}
          paginationStyleItem={{ width: 8, height: 8, marginHorizontal: 4 }}
          data={slides}
          onChangeIndex={({ index }) => {
            setCurrentIndex(index);
            if (index === slides.length - 1) {
              Animated.parallel([
                Animated.timing(buttonFadeAnim, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(buttonSlideAnim, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ]).start();
            } else {
              Animated.parallel([
                Animated.timing(buttonFadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(buttonSlideAnim, {
                  toValue: 20,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          )}
        />
        <Animated.View
          style={{
            opacity: buttonFadeAnim,
            transform: [{ translateY: buttonSlideAnim }],
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Permission')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
      </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default IntroSliderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 10,
  },
  desc: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: COLORS.dark_blue_charcoal,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});