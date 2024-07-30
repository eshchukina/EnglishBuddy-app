import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

const NoMoreCards: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noMoreCardsText}>No more cards</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  noMoreCardsText: {
    fontSize: 22,
    color: '#000',
  } as TextStyle,
});

export default NoMoreCards;
