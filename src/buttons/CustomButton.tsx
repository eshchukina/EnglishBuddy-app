import React, {ReactNode} from 'react';
import {Pressable, Text, StyleSheet, GestureResponderEvent} from 'react-native';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: ReactNode;
  buttonColor: string;
  textColor: string;
  pressedColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  buttonColor,
  textColor,
  pressedColor = '#fff6ee',
}) => {
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? pressedColor : buttonColor,
        },
        styles.button,
      ]}
      onPress={onPress}>
      <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'days2',
  },
});

export default CustomButton;
