import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/color';
import BackButton from '../../components/BackButton';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const logoAnim = useRef(new Animated.Value(30)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(30)).current;
  const linkAnim = useRef(new Animated.Value(30)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Temporary Navigate to Homepage
  const homeLinkAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.stagger(100, [
      Animated.timing(logoAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(linkAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Temporary Navigate to Homepage
      Animated.timing(homeLinkAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleLogin = () => {
    const newErrors = { email: '', password: '' };
    let valid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      Alert.alert('Login Success', 'You have logged in successfully!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: logoAnim }],
          paddingTop: 40,
          paddingBottom: 24,
        }}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: titleAnim }],
        }}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.description}>Log in to continue to your smart room</Text>
      </Animated.View>

      <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: formAnim }] }]}> 
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={'#999'}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: linkAnim }] }}>
        <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Redirect to password reset flow')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Temporary Navigate to Homepage */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: homeLinkAnim }] }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.linkText}>Go to Homepage</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    // marginBottom: 5,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    width: '100%',
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: COLORS.text,
    backgroundColor: '#ffff',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  error: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: 'red',
    marginBottom: 12,
    marginTop: -5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.dark_blue_charcoal,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  linkText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: COLORS.dark_blue_charcoal,
    marginTop: 12,
    // textDecorationLine: 'underline',
  },
});
