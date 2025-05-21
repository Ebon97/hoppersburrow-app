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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/color';
import BackButton from '../../components/BackButton';
import Feather from 'react-native-vector-icons/Feather';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(30)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(30)).current;
  const linkAnim = useRef(new Animated.Value(30)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.stagger(100, [
      Animated.timing(imageAnim, {
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
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSignUp = () => {
    let valid = true;
    const newErrors = { email: '', password: '', confirm: '' };

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!confirm) {
      newErrors.confirm = 'Please confirm your password';
      valid = false;
    } else if (password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      Alert.alert('Success', 'Account created successfully!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: imageAnim }],
          paddingTop: 40,
          paddingBottom: 24,
        }}
      >
        <Image
          source={require('../../../assets/onboarding/sign_up.png')}
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
        <Text style={styles.title}>Create Account</Text>
      </Animated.View>

      <Animated.View
        style={[styles.form, {
          opacity: fadeAnim,
          transform: [{ translateY: formAnim }],
        }]}
      >
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
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            style={styles.passwordInput}
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Feather
              name={showConfirm ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
        {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: linkAnim }] }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>I'm an existing user</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 240,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 30,
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
    marginBottom: 10,
    color: COLORS.text,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
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
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  linkText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: COLORS.dark_blue_charcoal,
    marginTop: 12,
  },
});
