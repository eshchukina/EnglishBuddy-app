import React from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import CustomButton from '../buttons/CustomButton';

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
}

const ModalFirst: React.FC<ModalComponentProps> = ({visible, onClose}) => {
  const {t} = useTranslation();

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{t('startText')}</Text>

          <CustomButton
            onPress={onClose}
            title={t('start')}
            buttonColor="#d86072"
            textColor="#262628"
            pressedColor="#c6c2f2"
          />
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
  modalContent: {
    width: '90%',
    padding: 30,
    backgroundColor: '#fff6ee',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#262628',
    marginBottom: 50,
    fontFamily: 'days2',
  },
});

export default ModalFirst;
