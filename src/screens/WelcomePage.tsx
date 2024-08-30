import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import CustomButton from '../buttons/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WelcomePageProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

type DataItem = {
  id: string;
  text: string;
};

const WelcomePage: React.FC<WelcomePageProps> = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('hasLaunched');
        if (value !== null) {
          // Значение существует, значит страница уже была показана
          setIsFirstLaunch(false);
          navigation.navigate('Home');
        } else {
          // Значение не существует, значит это первый запуск
          await AsyncStorage.setItem('hasLaunched', 'true');
        }
      } catch (error) {
        console.error('Ошибка при чтении из AsyncStorage', error);
      }
    };

    checkIfFirstLaunch();
  }, [navigation]);

  const data: DataItem[] = [
    {
      id: '1',
      text: 'Welcome to the English Buddy App!',
    },
    {
      id: '2',
      text: 'Elevate your English language proficiency with our extensive collection of 1000 common words',
    },
    {
      id: '3',
      text: "Enhance your English language skills by swiping right for words you've mastered and swiping left for those you're still learning",
    },
    {
      id: '4',
      text: "With a collection of 1000 common words, gradually eliminate the words you haven't mastered yet",
    },
    {
      id: '5',
      text: 'Start your journey towards English fluency today while effortlessly tracking your progress in mastering each word',
    },
  ];

  const handleButtonClick = () => {
    navigation.navigate('Home');
  };

  const zoomOut = {
    0: {
      opacity: 0,
      scale: 0.5,
      translateX: 0,
    },
    0.5: {
      opacity: 0.7,
      scale: 0.7,
      translateX: 0,
    },
    1: {
      opacity: 1,
      scale: 1,
      translateX: 0,
    },
  };


  if (!isFirstLaunch) {
    return null;
  }

  return (
    <Animatable.View 

    style={styles.container}>
      <View style={styles.rotatingImageContainer}>
        <Animatable.Image
  
          source={require('../../assets/belogo.jpg')}
          style={{
            width: 300,
            height: 300,
            resizeMode: 'contain',
            position: 'absolute',
            top: 50,
          }}
        />
      </View>

      <View style={styles.wrapper}>
        <Swiper
          loop={false}
          showsPagination
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          onIndexChanged={index => setCurrentPage(index)}
        >
          {data.map((item, index) => (
            <View key={item.id} style={styles.pageIndicators}>
              <Text style={styles.text}>
                {index === currentPage ? item.text : ''}
              </Text>
            </View>
          ))}
        </Swiper>

        {currentPage === data.length - 1 && (
          <View style={styles.headerButton}>
            <CustomButton
              onPress={handleButtonClick}
              title={
                <Animatable.Text animation={zoomOut} style={styles.buttonText}>
                  let's start
                </Animatable.Text>
              }
              buttonColor="#262628"
              textColor="#fff6ee"
              pressedColor="#c6c2f2"
            />
          </View>
        )}

        {currentPage < data.length - 1 && (
          <View style={styles.headerButton}>
            <CustomButton
              onPress={handleButtonClick}
              title={
                <Animatable.Text animation={zoomOut} style={styles.buttonText}>
                  skip
                </Animatable.Text>
              }
              buttonColor="#262628"
              textColor="#fff6ee"
              pressedColor="#c6c2f2"
            />
          </View>
        )}
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c6c2f2',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rotatingImageContainer: {
    alignItems: 'center',
    flex: 3,
  },
  wrapper: {
    backgroundColor: '#fff6ee',
    borderTopRightRadius: 200,
    borderTopLeftRadius: 0,
    flex: 2,
  },
  headerButton: {
    padding: 10,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d6dc82',
    marginHorizontal: 5,
  },
  activeDotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#c6c2f2',
    marginHorizontal: 5,
  },
  buttonText: {
    fontFamily: 'days2',
    fontSize: 20,
    textAlign: 'center',
    color: '#fff6ee',
  },
  text: {
    fontFamily: 'nexa-script-heavy',
    fontSize: 18,
    textAlign: 'center',
    color: '#262628',
    width: '95%',
  },
  pageIndicators: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 100,
  },
});

export default WelcomePage;
