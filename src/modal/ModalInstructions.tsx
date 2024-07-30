import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ModalProps,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
//import Ball from 'react-native-vector-icons/SimpleLineIcons';
import CustomButton from '../buttons/CustomButton';

interface ModalInstructionsProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalInstructions: React.FC<ModalInstructionsProps> = ({
  visible,
  onClose,
}) => {
  const {t} = useTranslation();
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
              <Text style={styles.text}>{t('text1')}</Text>

              <Text style={styles.text}>{t('text2')}</Text>

              <Text style={styles.text}>{t('text3')}</Text>
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
    width: '90%',
    height: '65%',
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
  text: {
    fontSize: 20,
    color: '#526466',
    fontFamily: 'days2',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ModalInstructions;
