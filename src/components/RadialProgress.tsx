import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Fireworks from './Fireworks';
interface RadialProgressProps {
  value: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ value }) => {


  const formattedPercentage = value ? value.toFixed(1) : '0.0';

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
      {value >= 100.0 ? (
        <>
        <Image
          source={require('../../assets/trophy.png')}
          style={{
            width: 100,
            resizeMode: 'contain',
            alignItems: 'center',
          }}
        />
      
        </>
      ) : (
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${isNaN(value) ? 0 : value}%`, backgroundColor: fgColor },
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
    textAlign: 'center',

    fontFamily: 'days2',
  },
});

export default RadialProgress;
