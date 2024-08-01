import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import CustomButton from '../buttons/CustomButton';
import SwipeCards from '../components/SwipeCards';
import Arrow from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

interface FlashcardDeckProps {
  navigation: {
    navigate: (screen: string) => void;
  };
  updateSwipedRightCount: (count: number) => void;
  setSelectedComponent: (component: string) => void;
  setIsPersonalCabinetOpen: (isOpen: boolean) => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  navigation,

}) => {
  const [isVisible, setIsVisible] = useState(true);
  const {t} = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 500);

    const hideTimeout = setTimeout(() => {
      clearInterval(interval);
      setIsVisible(false);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomButton
          onPress={() => navigation.navigate('Home')}
          title={<Arrow name="chevron-back" size={40} />}
          buttonColor="#fff6ee"
          textColor="#c6c2f2"
        />
         <Text style={styles.text}>
 
        {t('description')}
      </Text>
      </View>

      <SwipeCards
    
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'vidaloka',
    backgroundColor: '#fff6ee',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  header: {
    alignItems: 'flex-start',
    width: '100%',
    justifyContent: 'flex-start',
  },
  titleContainer:{
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  textIcon: {
    fontFamily: 'vidaloka',
    fontSize: 22,
    textAlign: 'center',
    color: '#6c526f',
    position: 'absolute',
    paddingRight: 50,
    top: 240,
    zIndex: 2,
  } as TextStyle,
  textIconTwo: {
    fontFamily: 'vidaloka',
    fontSize: 22,
    textAlign: 'center',
    color: '#6c526f',
    position: 'absolute',
    paddingLeft: 50,
    top: 240,
    zIndex: 2,
  } as TextStyle,
  text: {
    fontFamily: 'nexa-script-heavy',
    fontSize: 24,
    textAlign: 'center',
    color: '#262628',
    position: 'absolute',
    top: 50,
    zIndex: 2,
    margin: 10,
  } as TextStyle,
});

export default FlashcardDeck;