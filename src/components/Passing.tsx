import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Text, Image, ImageSourcePropType} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

interface MedalInfo {
  color: string;
  level: string;
  text: string;
  image: ImageSourcePropType | null;
}

const Passing: React.FC = () => {
  const [storedPercentage, setStoredPercentage] = useState<number | null>(null);
  const {t} = useTranslation();

  const loadPercentage = async () => {
    try {
      const storedPercentageStr = await AsyncStorage.getItem('percentage');
      if (storedPercentageStr !== null) {
        setStoredPercentage(parseFloat(storedPercentageStr));
      }
    } catch (error) {
      console.error('Error loading percentage from AsyncStorage:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPercentage();
    }, [])
  );

  const getMedalInfo = (): MedalInfo => {
    if (storedPercentage === null) {
      return {
        color: '#cd7f32',
        level: t('level_start'),
        text: '',
        image: null,
      };
    }
    if (storedPercentage >= 1 && storedPercentage <= 33) {
      return {
        color: '#cd7f32',
        level: t('level_novice'),
        text: t('text_novice'),
        image: require('../../assets/medal(1).png'),
      };
    } else if (storedPercentage > 33 && storedPercentage <= 66) {
      return {
        color: '#c0c0c0',
        level: t('level_intermediate'),
        text: t('text_intermediate'),
        image: require('../../assets/medal(3).png'),
      };
    } else if (storedPercentage > 66 && storedPercentage <= 99) {
      return {
        color: '#FFD700',
        level: t('level_advanced'),
        text: t('text_advanced'),
        image: require('../../assets/medal.png'),
      };
    } else if (storedPercentage > 99) {
      return {
        color: '#FFD700',
        level: t('level_expert'),
        text: t('text_expert'),
        image: require('../../assets/trophy.png'),
      };
    } else {
      return {
        color: '#cd7f32',
        level: t('level_start'),
        text: '',
        image: null,
      };
    }
  };

  const medalInfo = getMedalInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{medalInfo.text}</Text>
      <Text style={styles.text}>{medalInfo.level}</Text>
      {medalInfo.image && (
        <Image source={medalInfo.image} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontFamily: 'days2',
    fontSize: 20,
    textAlign: 'center',
    color: '#262628',
  },
  image: {
    marginTop: 20,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default Passing;
