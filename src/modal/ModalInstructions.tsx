import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ModalProps,
  ScrollView,
  Animated,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import CustomButton from '../buttons/CustomButton';
import Star from 'react-native-vector-icons/Ionicons';
import StarHalf from 'react-native-vector-icons/Ionicons';
import StarOutline from 'react-native-vector-icons/Ionicons';
import Cards from 'react-native-vector-icons/MaterialCommunityIcons';

interface ModalInstructionsProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalInstructions: React.FC<ModalInstructionsProps> = ({
  visible,
  onClose,
}) => {
  const {t} = useTranslation();
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const fadeIn = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animateImages = () => {
    fadeIn(fadeAnim1);

    setTimeout(() => {
      fadeOut(fadeAnim1);
      fadeIn(fadeAnim2);
    }, 2000);

    setTimeout(() => {
      fadeOut(fadeAnim2);
      fadeIn(fadeAnim3);
    }, 4000);

    setTimeout(() => {
      fadeOut(fadeAnim3);
      setTimeout(animateImages, 1000);
    }, 6000);
  };

  useEffect(() => {
    animateImages();
  }, [fadeAnim1, fadeAnim2, fadeAnim3]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <ScrollView>
            <View style={styles.userInfo}>
              <Text style={[styles.textModal, styles.buttonInfo]}>
                {t('welcome')}
              </Text>

              <Text style={styles.textModal}>{t('text1')}</Text>
              <Text style={styles.textModal}>{t('text2')}</Text>

              <Text style={styles.textModal}>{t('text3')}</Text>

              <Text style={styles.textModal}>{t('text4')}</Text>

              <Text style={styles.textModal}>{t('text5')}</Text>
              <Text style={[styles.textModal, styles.buttonInfo]}>
                <View style={styles.buttonContainer}>
                  <Text style={[styles.buttonText]}>open cards</Text>
                  <Text style={[styles.buttonText]}>
                    <Cards name="cards" color="#262628" size={40} />
                  </Text>
                </View>
              </Text>

              <Text style={styles.textModal}>{t('text6')}</Text>
              <Text style={[styles.textModal, styles.buttonInfo]}>
                <Animated.View style={{opacity: fadeAnim1}}>
                  <StarOutline name="star-outline" size={30} color="#262628" />
                </Animated.View>

                <Animated.View style={{opacity: fadeAnim2}}>
                  <StarHalf name="star-half-sharp" size={32} color="#262628" />
                </Animated.View>

                <Animated.View style={{opacity: fadeAnim3}}>
                  <Star name="star-sharp" size={32} color="#262628" />
                </Animated.View>
              </Text>
            </View>
            <View style={styles.button}>
              <CustomButton
                onPress={onClose}
                title={t('close')}
                buttonColor="#d86072"
                textColor="#262628"
                pressedColor="#c6c2f2"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff6ee',
    padding: 10,
    width: '95%',
    height: '70%',
    borderRadius: 15,
    alignItems: 'center',
  },
  icon: {
    textShadowColor: '#526466',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    width: 40,
  },
  userInfo: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  textModal: {
    fontSize: 16,
    padding: 5,
    color: '#262628',
    fontFamily: 'days2',
    marginBottom: 10,
    textAlign: 'justify',
  },
  buttonInfo: {
    fontFamily: 'nexa-script-heavy',
    color: '#c6c2f2',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 30,
  },
  buttonText: {
    color: '#262628',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'days2',
  },
});

export default ModalInstructions;
