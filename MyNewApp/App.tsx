import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalPortal } from "react-native-modals";
import Login from './screens/Login.tsx';
import Register from './screens/Register.tsx';
import Home from './screens/Home.tsx';
import userStore from './store/userStore.ts';
import Toast from 'react-native-toast-message';
import { StatusBar, View } from 'react-native';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen.tsx';
import ResetKeyScreen from './screens/ResetKeyScreen.tsx';
import NewPasswordScreen from './screens/NewPasswordScreen.tsx';
import VerifyEmailScreen from './screens/VerifyEmailScreen.tsx';

import AppSkeleton from './screens/components/AppSkeleton.tsx';
import Profile from './screens/Profile.tsx';
import QuizApp from './screens/QuizApp.tsx';
import AttemptedQuiz from './screens/AttemptedQuiz.tsx';
import Settings from './screens/Settings.tsx';
import QuizManagementScreen from './screens/QuizManagementScreen.tsx';
import Results from './screens/Results.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
  const { isAuth, user, initAuth } = userStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await initAuth(); // Wait for AsyncStorage
      
      // Show skeleton for 2-3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    };
    
    checkAuth();
  }, []);

  // Show skeleton loading screen while checking auth
  if (isLoading) {
    return <AppSkeleton />;
  }

  return (

    <NavigationContainer>
      <StatusBar
        backgroundColor="#041E42"
        barStyle='light-content'
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="QuizApp" component={QuizApp} />
            <Stack.Screen name="AttemptedQuiz" component={AttemptedQuiz} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="QuizManagement" component={QuizManagementScreen} />
            <Stack.Screen name="Results" component={Results} />
          
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Forgot" component={ForgetPasswordScreen} />
            <Stack.Screen name="Reset" component={ResetKeyScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </>
        )}
      </Stack.Navigator>
      <ModalPortal />
      <Toast />
    </NavigationContainer>

  );
};

export default App;