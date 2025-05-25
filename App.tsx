import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/onboarding/SplashScreen';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import IntroSliderScreen from './src/screens/onboarding/IntroSliderScreen';
import PermissionScreen from './src/screens/onboarding/PermissionScreens';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import LoginScreen from './src/screens/auth/LoginScreen';

import Home from './src/screens/Home';
import AccommodationListing from './src/screens/accommodation/AccommodationListing';
import AccommodationDetails from './src/screens/accommodation/AccommodationDetails';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="IntroSlider" component={IntroSliderScreen} />
        <Stack.Screen name="Permission" component={PermissionScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="AccommodationListing"
          component={AccommodationListing}
          options={{ headerShown: false }} // or true if you want a header
        />
        <Stack.Screen name="AccommodationDetails" component={AccommodationDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
