import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {ReactNode} from 'react';

interface IconButtonProps {
  iconComponent: ReactNode;
  text: string;
  onPress: () => void;
  marginLeft?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconComponent,
  text,
  onPress,
  marginLeft = 10,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {iconComponent}
      <Text style={[styles.text, {marginLeft}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  } as ViewStyle,
  text: {
    fontFamily: 'days2',
    color: '#262628',
    fontSize: 18,
  } as TextStyle,
});

export default IconButton;
