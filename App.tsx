import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Toast from 'react-native-toast-message';

import SplashScreen from './src/screens/onboarding/SplashScreen';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import IntroSliderScreen from './src/screens/onboarding/IntroSliderScreen';
import PermissionScreen from './src/screens/onboarding/PermissionScreens';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import LoginScreen from './src/screens/auth/LoginScreen';

import Home from './src/screens/Home';
import AccommodationListing from './src/screens/accommodation/AccommodationListing';
import AccommodationDetails from './src/screens/accommodation/AccommodationDetails';
import RentalListing from './src/screens/rental/RentalListing';
import RentalDetails from './src/screens/rental/RentalDetails';

import TopUpElectricity from './src/screens/electricity/TopUpElectricity';
import TopUpPayment from './src/screens/electricity/TopUpPayment';
import PaymentConfirmation from './src/screens/electricity/PaymentConfirmation';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="IntroSlider" component={IntroSliderScreen} />
          <Stack.Screen name="Permission" component={PermissionScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="Home" options={{ animation: 'none' }} component={Home} />
          <Stack.Screen
            name="AccommodationListing"
            component={AccommodationListing}
            options={({ route }) => ({
                animation: route?.params?.animate ? 'slide_from_right' : 'none',
              })}
          />
          <Stack.Screen name="AccommodationDetails" component={AccommodationDetails} />
          <Stack.Screen name="RentalListing" options={{ animation: 'none' }} component={RentalListing} />
          <Stack.Screen name="RentalDetails" component={RentalDetails} />
          {/* <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} /> */}

          <Stack.Screen
            name="TopUpElectricity"
            component={TopUpElectricity}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="TopUpPayment"
            component={TopUpPayment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentConfirmation"
            component={PaymentConfirmation}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
     <Toast topOffset={60} />
    </>
  );
};

export default App;
