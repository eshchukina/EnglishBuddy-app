import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import SQLite from 'react-native-sqlite-2';
import SwipeCards from 'react-native-swipe-cards';
import ModalAddForm from '../modal/ModalAddForm';
import Card from './Card';
import RadialProgress from './RadialProgress';
import Add from 'react-native-vector-icons/MaterialIcons';
import Fireworks from './Fireworks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reload from 'react-native-vector-icons/AntDesign';
import ModalRestart from '../modal/ModalRestart';
import CustomButton from '../buttons/CustomButton';
import ModalFirst from '../modal/ModalFirst';
import { useFocusEffect } from '@react-navigation/native';

const db = SQLite.openDatabase('mydatabase.db');

interface Word {
  id: number;
  word: string;
  translation: string;
  count: number;
}



interface CardData {
  id: number;
  word: string;
  translation: string;
  tag: string;
  count: number;
}

const SwipeCard: React.FC = () => {
  const [cards, setCards] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [swipedLeftCount, setSwipedLeftCount] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swipedRightCount, setSwipedRightCount] = useState<number>(0);
  const [totalSwipesRight, setTotalSwipesRight] = useState<number>(0);
  const [newWordsCount, setNewWordsCount] = useState<number>(0);

  console.log('progress', progress);
  console.log('cards', cards.length);
  console.log('totalSwipesRight', totalSwipesRight);


  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        try {
          const storedProgress = await AsyncStorage.getItem('percentage');
          if (storedProgress !== null) {
            setProgress(parseFloat(storedProgress));
          }
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      };

      loadProgress();
    }, [progress])
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [storedCount, storedTotalSwipesRight, hasSeenModal] = await Promise.all([
          AsyncStorage.getItem('newWordsCount'),
          AsyncStorage.getItem('totalSwipesRight'),
          AsyncStorage.getItem('hasSeenModal')
        ]);
        if (storedCount !== null) {
          setNewWordsCount(parseInt(storedCount, 10));
        }
        if (storedTotalSwipesRight !== null) {
          setTotalSwipesRight(parseInt(storedTotalSwipesRight, 10));
        }
        if (!hasSeenModal) {
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);



  useEffect(() => {
    const checkIfModalShown = async () => {
      const hasSeenModal = await AsyncStorage.getItem('hasSeenModal');
      if (!hasSeenModal) {
        setIsModalVisible(true);
      }
    };
    checkIfModalShown();
  }, []);

  const handleCloseModal = async () => {
    restartApp();
    await AsyncStorage.setItem('hasSeenModal', 'true');
    setIsModalVisible(false);
  };

  const createTable = useCallback(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY,
          word TEXT,
          translation TEXT,
          count INTEGER
        )`,
        [],
        () => {
          // console.log('Table created');
        },
        error => {
          // console.log('Error creating table:', error);
        },
      );
    });
  }, []);

  const saveWords = useCallback((words: Omit<Word, 'count'>[]) => {
    db.transaction(tx => {
      words.forEach(word => {
        tx.executeSql(
          `INSERT INTO words (id, word, translation, count) VALUES (?, ?, ?, ?)`,
          [word.id, word.word, word.translation, 0],
          () => {
            // console.log(`Word ${word.word} inserted`);
          },
          error => {
            // console.log('Error inserting word:', error);
          },
        );
      });
    });
  }, []);

  const getWords = useCallback(() => {
    
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM words WHERE count < 3 ORDER BY RANDOM()`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const wordsList: Word[] = [];
          for (let i = 0; i < rows.length; i++) {
            wordsList.push(rows.item(i));
          }
          // console.log('Fetched words from DB:', wordsList);
          setCards(wordsList);
        },
        error => {
          // console.log('Error fetching words:', error);
        },
      );
    });
  }, []);

  const fetchWords = useCallback(async () => {

    try {
      const response = await fetch('https://eb-api.una-team.pro/words');
      const data: Omit<Word, 'count'>[] = await response.json();
      // console.log('Fetched words from API:', data);
      // saveWords(data);
      //const first100Words = data.slice(0, 50);

      // Сохраняем эти записи в SQLite
      saveWords(data);
    } catch (error) {
      // console.error('Error fetching words:', error);
    }

  }, [saveWords]);

  useEffect(() => {
    createTable();
    fetchWords().then(() => {
      getWords();
    });
  }, [createTable, fetchWords, getWords]);

  useEffect(() => {
    calculateProgress();
  }, [totalSwipesRight]);
  

  const calculateProgress = async () => {
    try {
      const totalSwipesRightValue = await AsyncStorage.getItem('totalSwipesRight');
      const swipes = totalSwipesRightValue ? parseInt(totalSwipesRightValue, 10) : 0;
  
      if (cards.length === 0) {
        // Обработка случая, когда нет карточек
        setProgress(0);
        return;
      }
 // console.log('newWordsCount', newWordsCount)
      // Рассчет прогресса
      const newProgress = (swipes /  3000) * 100;
      setProgress(newProgress);
  
      // Сохранение прогресса в AsyncStorage
      await AsyncStorage.setItem('percentage', newProgress.toString());
    } catch (error) {
      console.error('Error calculating progress:', error);
    }
  };
  
  

  const handleYup = (card: Word) => {
    setSwipedRightCount(prevCount => prevCount + 1);
    setTotalSwipesRight(prevTotal => {
      const newTotal = prevTotal + 1;
      AsyncStorage.setItem('totalSwipesRight', newTotal.toString());
      return newTotal;
    });
    calculateProgress();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT count FROM words WHERE id = ?;',
        [card.id],
        (tx, result) => {
          if (result.rows.length > 0) {
            const currentCount = result.rows.item(0).count || 0;
            const newCount = currentCount + 1;
            tx.executeSql(
              'UPDATE words SET count = ? WHERE id = ?;',
              [newCount, card.id],
              () => {
                setCards(prevCards =>
                  prevCards.map(c =>
                    c.id === card.id ? {...c, count: newCount} : c,
                  ).filter(c => c.count < 3),
                );
                setCards(prevCards => {
                  const shuffledCards = [...prevCards];
                  for (let i = shuffledCards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledCards[i], shuffledCards[j]] = [
                      shuffledCards[j],
                      shuffledCards[i],
                    ];
                  }
                  return shuffledCards;
                });
              },
              error => {
                console.log('Error updating count:', error);
              },
            );
          }
        },
        error => {
          console.log('Error fetching count:', error);
        },
      );
    });
  };

  const handleNope = (card: Word) => {
    setSwipedLeftCount(prevCount => prevCount + 1);

  };

  const addWordToDatabase = useCallback(async (word: string, translation: string) => {  
    try {
      // Обновляем счетчик новых слов
      const currentCount = await AsyncStorage.getItem('newWordsCount');
      const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1;
      await AsyncStorage.setItem('newWordsCount', newCount.toString());
  
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO words (word, translation, count) VALUES (?, ?, ?)`,
          [word, translation, 0],
          () => {
            console.log(`Word ${word} inserted`);
            // Обновляем количество новых слов в состоянии
            setNewWordsCount(newCount);
            // Перезагрузите слова, чтобы обновить список карточек
            getWords();
          },
          error => {
            console.error('Error inserting word:', error);
          },
        );
      });
    } catch (error) {
      console.error('Error updating new words count:', error);
    }
  }, [getWords]);
  
  const handleAddWord = (word: string, translation: string) => {

    addWordToDatabase(word, translation);


  };
  
const restartApp = async () => {
  setLoading(true);
  setTotalSwipesRight(0);
  try {
    console.log('Restarting app...');

    // Очистить AsyncStorage
    await AsyncStorage.removeItem('totalSwipesRight');
    await AsyncStorage.removeItem('percentage');
    await AsyncStorage.removeItem('newWordsCount');

    console.log('Cleared AsyncStorage');

    // Удалить таблицу и создать её заново
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS words;',
        [],
        () => {
          console.log('Table dropped');
          // Таблица успешно удалена, теперь создаём её заново
          createTable();
          console.log('Table recreated');

          // Загрузить данные из API
          fetchWords().then(() => {
            getWords();
            console.log('Words fetched and loaded');
          }).catch(error => {
            console.error('Error fetching words:', error);
          });

          // Пересчитать прогресс
          calculateProgress();
        },
        error => {
          console.error('Error dropping table:', error);
        },
      );
    });
  } catch (error) {
    console.error('Error restarting app:', error);
  }
  setLoading(false);
};

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#d86072" />
      ) : (
        <>
          <View style={styles.containerProgress}>
            <RadialProgress value={progress} />
          </View>
          <View style={styles.firework}>
            {progress >= 100 ? <Fireworks /> : null}
          </View>
          {progress < 100 ? (
            <SwipeCards
              cards={cards}
              loop={true}
              onClickHandler={() => {}}
              showNope={false}
              showMaybe={false}
              showYup={false}
              renderCard={(cardData: CardData) => <Card {...cardData} />}
              handleYup={handleYup}
              handleNope={handleNope}
              hasMaybeAction={false}
              renderNoMoreCards={() => {
                null;
              }}
            />
          ) : null}

          <View style={styles.buttonContainer}>
            <View>
              <CustomButton
                onPress={() => setShowConfirmationModal(true)}
                title={<Reload name="reload1" size={40} />}
                buttonColor="#c6c2f2"
                textColor="#fff6ee"
              />
            </View>
           
           
            {/* {progress < 100.0 ? (
              <CustomButton
                onPress={() => setShowForm(true)}
                title={<Add name="add" size={40} />}
                buttonColor="#c6c2f2"
                textColor="#fff6ee"
              />
            ) : null} */}

          </View>
          {/* <ModalAddForm
            visible={showForm}
            onClose={() => setShowForm(false)}
            onAddWord={handleAddWord}
          /> */}

          
          <ModalRestart
            isVisible={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onRestart={restartApp}
          />
        </>
      )}
      <ModalFirst visible={isModalVisible} onClose={handleCloseModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonContainer: {

    justifyContent: 'space-between',

    paddingBottom: 30,
    alignItems: 'center',
  },
  button: {
    borderRadius: 15,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#a9b388',
    fontFamily: 'vidaloka',
  },
  containerProgress: {
    position: 'absolute',
    top: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#fefae0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 45,
    borderRadius: 20,
    width: 250,
    textAlign: 'center',
    color: '#756685',
    margin: 'auto',
    borderWidth: 2,
    borderColor: '#5f6f52',
  },
  modalText: {
    fontFamily: 'vidaloka',
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#6c526f',
    textAlign: 'center',
    marginTop: 15,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 0,
  },
  addButton: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  toggleButtonText: {
    fontFamily: 'vidaloka',
    fontSize: 20,
    color: '#783d19',
  },
  yupStyle: {
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 0,
  },
  yupTextStyle: {
    fontSize: 0,
  },
  maybeStyle: {
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  maybeTextStyle: {
    fontSize: 0,
    color: 'blue',
  },
  nopeStyle: {
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 0,
  },
  nopeTextStyle: {
    fontSize: 0,
  },
  firework: {
    position: 'absolute',
    top: 150,
  },
});

export default SwipeCard;
