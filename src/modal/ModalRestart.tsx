import React from 'react';
import { View, Text, Modal, StyleSheet, ModalProps } from 'react-native';
import CustomButton from '../buttons/CustomButton';
import {useTranslation} from 'react-i18next';

interface ModalRestartProps extends ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRestart: () => void;
}

const ModalRestart: React.FC<ModalRestartProps> = ({ isVisible, onClose, onRestart }) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {t('restart')}
          </Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={() => {
                onClose();
                onRestart();
              }}
              title={t('yes')}

              buttonColor="#d86072"
              textColor="#262628"
              pressedColor="#c6c2f2"
            />
            <CustomButton
              onPress={onClose}
              title={t('no')}
              buttonColor="#d86072"
              textColor="#262628"
              pressedColor="#c6c2f2"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff6ee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  modalText: {
    fontFamily: 'days2',
    padding: 5,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#6c526f',
    textAlign: 'center',
    marginTop: 15,
  },
  buttonContainer: {
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
});

export default ModalRestart;
