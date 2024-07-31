import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RadialProgressProps {
  value: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ value }) => {
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const loadPercentage = async () => {
      try {
        const storedPercentage = await AsyncStorage.getItem('percentage');
        if (storedPercentage !== null) {
          setPercentage(parseFloat(storedPercentage));
        }
      } catch (error) {
        console.error('Error loading percentage from AsyncStorage:', error);
      }
    };

    loadPercentage();
  }, []);

  useEffect(() => {
    const savePercentage = async () => {
      try {
        await AsyncStorage.setItem('percentage', percentage.toString());
        console.log('Data saved to AsyncStorage:', percentage);
      } catch (error) {
        console.error('Error saving percentage to AsyncStorage:', error);
      }
    };

    savePercentage();
  }, [percentage]);

  useEffect(() => {
    setPercentage(value);
  }, [value]);

  const formattedPercentage = percentage ? percentage.toFixed(1) : '0.0';

  const fgColor = '#d86072';
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

  return (
    <Animatable.View animation={zoomOut} style={styles.container}>
      {percentage >= 100 ? (
        <Image
          source={require('../../assets/trophy.png')}
          style={{
            width: 100,
            resizeMode: 'contain',
            alignItems: 'center',
          }}
        />
      ) : (
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${isNaN(percentage) ? 0 : percentage}%`, backgroundColor: fgColor },
            ]}
          />
        </View>
      )}
      <Text style={styles.percentageText}>{formattedPercentage}%</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    width: '70%',
    height: 20,
    backgroundColor: '#f9ebc7',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  percentageText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#262628',
  },
});

export default RadialProgress;
