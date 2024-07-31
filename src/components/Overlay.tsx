import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  ImageBackground,
} from 'react-native';

interface OverlayProps {
  onPress: () => void;
}

const Overlay: React.FC<OverlayProps> = ({onPress}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(true);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onPress();
    });
  }, [fadeAnim, onPress]);

  useEffect(() => {
    fadeIn();
  }, [fadeIn]);

  const fade = () => {
    fadeOut();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={fade}>
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <ImageBackground
          source={require('../../assets/n.png')}
          style={styles.background}>
        </ImageBackground>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Overlay;
