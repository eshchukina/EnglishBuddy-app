import React, {useState} from 'react';
import {Modal, View, Text, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomButton from '../buttons/CustomButton';
import * as Validation from '../utils/Validation';
import {useTranslation} from 'react-i18next';

interface ModalAddFormProps {
  visible: boolean;
  onClose: () => void;
  onAddWord: (word: string, translation: string) => void;
}

const ModalAddForm: React.FC<ModalAddFormProps> = ({
  visible,
  onClose,
  onAddWord,
}) => {
  const [word, setWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const {t} = useTranslation();

  const handleCloseModal = () => {
    onClose();
  };

  const handleCreateWord = () => {
    if (!Validation.isWordAndTranslationValid(word, translation)) {
      return;
    }

    onAddWord(word, translation);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent]}>
          <Text style={styles.titleText}>
          {t('add')}

          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input]}
              placeholder={t('word')}
              placeholderTextColor="#d6dc82"
              value={word}
              onChangeText={text => setWord(text)}
            />

            <TextInput
              style={[styles.input]}
              placeholder={t('translation')}
              placeholderTextColor="#d6dc82"
              value={translation}
              onChangeText={text => setTranslation(text)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleCreateWord}
              title={t('create')}
              buttonColor="#d86072"
              textColor="#262628"
              pressedColor="#c6c2f2"
            />

            <CustomButton
              onPress={handleCloseModal}
              title={
                <Text>
                 {t('close')}
                </Text>
              }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#fff6ee',
  },
  titleText: {
    textAlign: 'center',
    fontFamily: 'days2',
    padding: 10,
    fontSize: 18,
    color: '#262628',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff6ee',
    borderColor: '#d86072',
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    marginBottom: 15,
  },
  inputContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ModalAddForm;
