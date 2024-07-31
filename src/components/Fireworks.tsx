import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';

type Color = string;

const Fireworks: React.FC = () => {
  const fadingOpacity = useRef(new Animated.Value(1)).current;
  const movingBall = useRef(new Animated.Value(0)).current;

  const getRandom = (n: number): number => {
    return Math.round(Math.random() * n);
  };

  const animateOpacity = () => {
    fadingOpacity.setValue(1);
    Animated.timing(fadingOpacity, {
      toValue: 0,
      duration: 700,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => animateOpacity());
  };

  const animateBall = () => {
    movingBall.setValue(0);
    Animated.timing(movingBall, {
      toValue: 1,
      duration: 700,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => animateBall());
  };

  useEffect(() => {
    animateOpacity();
    animateBall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const balls: string[] = [];
  const randomTops: Animated.AnimatedInterpolation<number>[] = [];
  const randomLefts: Animated.AnimatedInterpolation<number>[] = [];
  const randomColors: Color[] = [];

  for (let i = 0; i < 30; i++) {
    balls.push('');
    randomTops[i] = movingBall.interpolate({
      inputRange: [0, 1],
      outputRange: [100, getRandom(200)],
    });
    randomLefts[i] = movingBall.interpolate({
      inputRange: [0, 1],
      outputRange: [100, getRandom(200)],
    });
    randomColors[i] = `rgb(${getRandom(255)},${getRandom(255)},${getRandom(
      255,
    )})`;
  }

  const ballOpacity = fadingOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.explosionBoundary}>
      {balls.map((ball, index) => (
        <Animated.View
          key={index}
          style={[
            styles.ball,
            {
              top: randomTops[index],
              left: randomLefts[index],
              opacity: ballOpacity,
              backgroundColor: randomColors[index],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  explosionBoundary: {
    position: 'relative',
    height: 200,
    width: 200,
  },
  ball: {
    position: 'absolute',
    height: 7,
    width: 7,
    borderRadius: 3,
  },
});

export default Fireworks;
