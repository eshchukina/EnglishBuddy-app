import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import Navigation from './src/navigation/Navigation';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';

const App = () => {


  async function requestNotificationPermission() {
    try {
      const granted = await messaging().requestPermission();
      if (granted) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  

  async function requestUserPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Token retrieval error:', error);
    }
  };

  useEffect(() => {

    requestUserPermission();
    requestNotificationPermission();

    getToken();
    SplashScreen.hide();
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    return unsubscribe;
    
  }, []);

  return <Navigation />;
};

export default App;
