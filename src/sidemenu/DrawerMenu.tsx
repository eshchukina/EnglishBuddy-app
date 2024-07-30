import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import Description from 'react-native-vector-icons/MaterialCommunityIcons';
import ShareIcon from 'react-native-vector-icons/AntDesign';
import Star from 'react-native-vector-icons/Octicons';
import Document from 'react-native-vector-icons/Ionicons';
import Mail from 'react-native-vector-icons/AntDesign';
import ToggleSwitch from 'toggle-switch-react-native';
import ModalInstructions from '../modal/ModalInstructions';
import IconButton from '../buttons/IconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reviewPage from '../utils/reviewApp';
import shareApp from '../utils/shareApp';
import {useTranslation} from 'react-i18next';
import i18n from '../translation/i18n';
import sendEmail from '../utils/sendEmail';

interface DrawerMenuProps {
  setIsEnabled: (enabled: boolean) => void;
  isEnabled: boolean;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({setIsEnabled, isEnabled}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
   const {t} = useTranslation();

  useEffect(() => {
    const loadSwitchState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('languageSwitch');
        if (storedState !== null) {
          const newState = JSON.parse(storedState);
          setIsEnabled(newState);
          const newLang = newState ? 'en' : 'ru';
           i18n.changeLanguage(newLang);
          await AsyncStorage.setItem('selectedLanguage', newLang);
          console.log('Selected language:', newLang);
        } else {
          setIsEnabled(true);
          const defaultLang = 'en';
          i18n.changeLanguage(defaultLang);
          await AsyncStorage.setItem('selectedLanguage', defaultLang);
          console.log('Selected language:', defaultLang);
        }
      } catch (error) {
        console.error('Failed to load switch state', error);
      }
    };

    loadSwitchState();
  }, [setIsEnabled]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleSwitch = async () => {
    const newState = !isEnabled;
    const newLang = newState ? 'en' : 'ru';

    try {
     await i18n.changeLanguage(newLang);
      console.log('Language changed to:', newLang);
      await AsyncStorage.setItem('languageSwitch', JSON.stringify(newState));
      await AsyncStorage.setItem('selectedLanguage', newLang);
    } catch (error) {
      console.error('Failed to save switch state or change language', error);
    }
    setIsEnabled(newState);
  };

  const handleButtonPress = () => {
    const url =
      'https://www.freeprivacypolicy.com/live/fb11492e-6e29-49d1-90dd-af0fc50e0100';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={styles.switchContainer}>
            <Text style={styles.textTitle}>Ru</Text>
            <ToggleSwitch
              isOn={isEnabled}
              onColor="#fff6ee"
              offColor="#fff6ee"
              thumbOnStyle={styles.thumbOnStyle}
              thumbOffStyle={styles.thumbOffStyle}
              size="medium"
              onToggle={toggleSwitch}
            />

            <Text style={styles.textTitle}>En</Text>
          </View>
        </View>

        <View style={styles.button}>
          <IconButton
            iconComponent={
              <ShareIcon
                name="sharealt"
                size={40}
                color="#d86072"
                style={styles.icon}
              />
            }
            text={t('share')}
            onPress={shareApp}
          />
        </View>

        <View style={styles.button}>
          <IconButton
            iconComponent={
              <Mail name="mail" size={40} color="#d6dc82" style={styles.icon} />
            }
            text={t('connect')}
            onPress={sendEmail}
          />
        </View>

        <View style={styles.button}>
          <IconButton
            iconComponent={
              <Star
                name="comment"
                size={40}
                color="#d86072"
                style={styles.icon}
              />
            }
            text={t('review')}
            onPress={reviewPage}
          />
        </View>

        <View style={styles.button}>
          <IconButton
            iconComponent={
              <Document
                name="document-attach-outline"
                size={40}
                color="#d6dc82"
                style={styles.icon}
              />
            }
            text="privacy policy"
            onPress={handleButtonPress}
          />
        </View>

        <View style={styles.button}>
          <IconButton
            iconComponent={
              <Description
                name="script-text-outline"
                size={40}
                color="#d86072"
                style={styles.icon}
              />
            }
            text={t('instructions')}
            onPress={openModal}
          />
        </View>
      </View>

      <ModalInstructions visible={modalVisible} onClose={closeModal} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContainer: {
    width: '60%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    textShadowColor: '#cec5c0',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: 'nexa-script-heavy',
    fontSize: 25,
    color: '#d86072',
    textAlign: 'center',
  },
  thumbOnStyle: {
    backgroundColor: '#d6dc82',
  },
  thumbOffStyle: {
    backgroundColor: '#d6dc82',
  },
  button: {
    marginVertical: 10,
  },
});

export default DrawerMenu;
