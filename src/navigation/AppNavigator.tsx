import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from '../screens/home/HomeScreen';
import PlantCameraScreen from '../screens/plants/PlantCameraScreen';
import PlantResultScreen from '../screens/plants/PlantResultScreen';
import RecipeCameraScreen from '../screens/recipes/RecipeCameraScreen';
import RecipeResultScreen from '../screens/recipes/RecipeResultScreen';

import { Routes, RootStackParamList } from './routes';
import colors from '../theme/colors';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Stack.Navigator
        initialRouteName={Routes.Home}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name={Routes.Home}
          component={HomeScreen}
          options={{
            title: 'Plant & Recipe Identifier',
          }}
        />
        <Stack.Screen
          name={Routes.PlantCamera}
          component={PlantCameraScreen}
          options={{
            title: 'Identify Plant',
          }}
        />
        <Stack.Screen
          name={Routes.PlantResult}
          component={PlantResultScreen}
          options={{
            title: 'Plant Results',
          }}
        />
        <Stack.Screen
          name={Routes.RecipeCamera}
          component={RecipeCameraScreen}
          options={{
            title: 'Identify Recipe',
          }}
        />
        <Stack.Screen
          name={Routes.RecipeResult}
          component={RecipeResultScreen}
          options={{
            title: 'Recipe Results',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
