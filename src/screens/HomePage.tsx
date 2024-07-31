import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';
import Overlay from '../components/Overlay';
import Passing from '../components/Passing';
import IconButton from '../buttons/IconButton';
import Cards from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Setting from 'react-native-vector-icons/SimpleLineIcons';
import CustomButton from '../buttons/CustomButton';
import DrawerMenu from '../sidemenu/DrawerMenu';
import {useTranslation} from 'react-i18next';

interface HomePageProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const {t} = useTranslation();

  const drawerTranslateX = useRef(new Animated.Value(-screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const fadeIn = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animateImages = () => {
    fadeIn(fadeAnim1);

    setTimeout(() => {
      fadeOut(fadeAnim1);
      fadeIn(fadeAnim2);
    }, 2000);

    setTimeout(() => {
      fadeOut(fadeAnim2);
      fadeIn(fadeAnim3);
    }, 4000);

    setTimeout(() => {
      fadeOut(fadeAnim3);
      setTimeout(animateImages, 1000);
    }, 6000);
  };

  useEffect(() => {
    animateImages();
  }, [fadeAnim1, fadeAnim2, fadeAnim3]);

  useEffect(() => {
    AsyncStorage.getItem('instructionsShown').then(value => {
      if (!value) {
        setShowInstructions(true);
        AsyncStorage.setItem('instructionsShown', 'true');
      }
    });
  }, []);

  const openFlash = () => {
    navigation.navigate('FlashcardDeck');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prevState => !prevState);
  };

  useEffect(() => {
    Animated.timing(drawerTranslateX, {
      toValue: isDrawerOpen ? 0 : screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [drawerTranslateX, fadeAnim, isDrawerOpen]);

  const closeDrawer = () => {
    toggleDrawer();
  };

  return (
    <TouchableWithoutFeedback onPress={isDrawerOpen ? closeDrawer : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/belogo1.jpg')}
            style={{
              width: 150,
              height: 130,
            }}
          />
          <IconButton
            iconComponent={<Setting name="menu" size={50} color="#d86072" />}
            text=""
            onPress={toggleDrawer}
          />
        </View>
        <Passing />

        <CustomButton
          onPress={() => {
            setIsPressed(true);
            openFlash();
          }}
          title={
            <View style={styles.headerButton}>
              <Text
                style={[
                  styles.buttonText,
                  isPressed && styles.buttonActiveText,
                ]}>
                {t('mainButton')}
              </Text>
              <Text>
                <Cards name="cards" color="#262628" size={40} />
              </Text>
            </View>
          }
          buttonColor="#d6dc82"
          textColor="#262628"
          pressedColor="#c6c2f2"
        />
        <Animated.View
          style={[
            styles.drawer,
            {transform: [{translateX: drawerTranslateX}]},
            {opacity: fadeAnim},
          ]}>
          <DrawerMenu />
        </Animated.View>
        {isDrawerOpen && <Overlay onPress={toggleDrawer} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6ee',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  buttonInfo: {
    alignItems: 'center',
    textAlign: 'center',
  },
  modalContent: {
    padding: 35,
    paddingBottom: 30,
    borderRadius: 20,
    width: '95%',
    textAlign: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: '#5f6f52',
    backgroundColor: '#fefae0',
    color: '#783d19',
  },
  text: {
    fontFamily: 'vidaloka',
    fontSize: 20,
    textAlign: 'center',
    color: '#5f6f52',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d6dc82',
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 50,
    width: 150,
  },
  closeButton: {
    borderRadius: 50,
    padding: 15,
    marginTop: 50,
    marginBottom: 150,
    marginLeft: 60,
    marginRight: 60,
    alignItems: 'center',
    backgroundColor: '#5f6f52',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#262628',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'days2',
  },
  buttonActiveText: {
    color: '#262628',
  },
  textModal: {
    fontSize: 18,
    color: '#783d19',
    margin: 5,
    textAlign: 'justify',
  },
  button2: {
    backgroundColor: '#a9b388',
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 16,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    width: 100,
    margin: 'auto',
  },
  header: {
    paddingRight: 10,
    top: 20,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawer: {
    backgroundColor: '#c6c2f2',
    zIndex: 200,
    position: 'absolute',
    top: 0,
    bottom: 20,
    right: 0,
    width: 240,
    height: screenHeight,
  },
  headerButton: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default HomePage;
