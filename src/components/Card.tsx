import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,

} from 'react-native';
import Star from 'react-native-vector-icons/Ionicons';
import StarHalf from 'react-native-vector-icons/Ionicons';
import StarOutline from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-vector-icons/AntDesign';
import Tts from 'react-native-tts';


interface CardProps {
  word: string;
  translation: string;
  count: number;
}

const Card: React.FC<CardProps> = ({ word, translation, count }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const frontOpacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const backOpacity = useRef<Animated.Value>(new Animated.Value(0)).current;

  const speak = () => {
    const thingToSay = word;
    Tts.speak(thingToSay);
  };

  const flipCard = () => {
    const newIsFlipped = !isFlipped;

    const animations = [
      Animated.timing(frontOpacity, {
        toValue: newIsFlipped ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backOpacity, {
        toValue: newIsFlipped ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ];

    Animated.parallel(animations, { stopTogether: false }).start(() => {
      setIsFlipped(newIsFlipped);
    });
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: frontOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: backOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const renderStar = () => {
    if (count < 0 || count == null) {
      return <StarOutline name="star-outline" size={30} color="#262628" />;
    } else if (count === 1  || count == null) {
      return <StarHalf name="star-half-sharp" size={32} color="#262628" />;
    } else if (count === 2) {
      return <Star name="star-sharp" size={32} color="#262628" />;
    } else if (count >= 3) {
      return <Star name="star-sharp" size={32} color="#262628" />;
    } else {
      return <StarOutline name="star-outline" size={30} color="#262628" />;
    }
  };

  return (
    <Pressable style={styles.cardContainer} onPress={flipCard}>
      <View style={styles.flashcard}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Text style={styles.cardStar}>{renderStar()}</Text>
          <Text style={styles.cardText}>{word}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <Text style={styles.cardStar}>{renderStar()}</Text>
          <Text style={styles.cardText}>{translation}</Text>
        </Animated.View>
      </View>
      <Pressable
        style={styles.soundContainer}
        onPress={speak}
      >
        <Text style={styles.soundButton}>
          <Sound name="sound" size={40} />
        </Text>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flashcard: {
    marginTop: 50,
    width:  300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d6dc82',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    textAlign: 'center',
  },
  cardBack: {
    position: 'absolute',
    backgroundColor: '#d6dc82',
    top: 0,
    textAlign: 'center',
  },
  soundButton: {
    color: '#d86072',
  },
  soundContainer: {
    padding: 10,
    zIndex: 100,
  },
  soundWrapper: {},
  cardText: {
    color: '#262628',
    fontFamily: 'days2',
    textAlign: 'center',
    fontSize: 34,
  },
  cardContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 70,
  },
  cardStar: {
    marginBottom: 10,
  },
});

export default Card;