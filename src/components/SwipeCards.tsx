import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
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
const db = SQLite.openDatabase('mydatabase.db');

interface ApiData {
  word: string;
  translation: string;
}

interface CardData {
  id: number;
  word: string;
  translation: string;
  tag: string;
  count: number;
}

const SwipeCard: React.FC = () => {
  const [dataSource, setDataSource] = useState<string>('');
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [swipedRightCount, setSwipedRightCount] = useState(0);
  const [swipedLeftCount, setSwipedLeftCount] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [totalSwipesRight, setTotalSwipesRight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    fetchAndSetData();
    await AsyncStorage.setItem('hasSeenModal', 'true');
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const calculateProgress = () => {
    setProgress((totalSwipesRight / 3000) * 100);
    AsyncStorage.setItem('percentage', progress.toString());
  };

  useEffect(() => {
    const loadTotalSwipesRight = async () => {
      try {
        const savedTotalSwipesRight = await AsyncStorage.getItem(
          'totalSwipesRight',
        );
        if (savedTotalSwipesRight !== null) {
          setTotalSwipesRight(parseInt(savedTotalSwipesRight, 10));
        }
      } catch (error) {
        console.error(
          'Error loading totalSwipesRight from AsyncStorage:',
          error,
        );
      }
    };

    loadTotalSwipesRight();
    fetchAndSetData();
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('https://eb-api.una-team.pro/words');
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, translation TEXT, tag TEXT, count INTEGER);',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Error creating table:', error);
      },
    );
  });

  const fetchAndSetData = async () => {
    try {
      const netInfoState = await NetInfo.fetch();

      db.transaction(async tx => {
        const countResult = await new Promise((resolve, reject) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM words;',
            [],
            (tx, result) => {
              resolve(result);
            },
            error => {
              reject(error);
            },
          );
        });

        let count = countResult.rows.item(0).count;

        if (count === 0 && netInfoState.isConnected) {
          const apiData = await fetchDataFromAPI();

          apiData.forEach((word: string, translation: string) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
                [word, translation, '', 0],

                error => {
                  console.log('Error inserting data: ', error);
                },
              );
            });
          });

          setCards(apiData);
        } else {
          setDataSource('SQLite');

          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM words WHERE count < 3 ORDER BY RANDOM();',
              [],
              (tx, result) => {
                const len = result.rows.length;
                const data = [];
                for (let i = 0; i < len; i++) {
                  const row = result.rows.item(i);
                  data.push({
                    id: row.id,
                    word: row.word,
                    translation: row.translation,
                    tag: row.tag,
                    count: row.count,
                  });
                }
                const shuffledData = data.sort(() => Math.random() - 0.5);

                setCards(shuffledData);

                setLoading(false);
              },
            );
          });

          db.transaction(tx => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM words;',
              [],

              error => {
                console.log(
                  'Error while fetching word count from SQLite:',
                  error,
                );
              },
            );
          });
        }
      });
      let count;
      if (count === 0 && netInfoState.isConnected) {
        setCards(apiData);
      } else {
        setDataSource('SQLite');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM words WHERE count >= 3;',
        [],

        error => {
          console.log(
            'Error fetching count of cards with count >= 3 from SQLite:',
            error,
          );
        },
      );
    });
  }, [swipedRightCount, swipedLeftCount]);

  const handleYup = (card: number) => {
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
          const currentCount = result.rows.item(0).count || 0;
          tx.executeSql(
            "UPDATE words SET tag = 'right', count = ? WHERE id = ?;",
            [currentCount + 1, card.id],

            error => {
              console.log('Error updating tag and count:', error);
            },
          );
        },
      );
    });
  };

  const handleNope = (card: number) => {
    setSwipedLeftCount(prevCount => prevCount + 1);
    setTotalSwipesRight(prevTotal => {
      const newTotal = prevTotal - 1;
      AsyncStorage.setItem('totalSwipesRight', newTotal.toString());
      return newTotal;
    });
    calculateProgress();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT count FROM words WHERE id = ?;',
        [card.id],
        (tx, result) => {
          const currentCount = result.rows.item(0).count || 0;
          tx.executeSql(
            "UPDATE words SET tag = 'left', count = ? WHERE id = ?;",
            [currentCount + 1, card.id],

            error => {
              console.log('Error updating tag and count:', error);
            },
          );
        },
      );
    });
  };

  const handleAddWord = (word: string, translation: string) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
        [word, translation, '', 0],

        error => {
          console.log('Error inserting data: ', error);
        },
      );
    });

    const newCard: CardData = {
      id: cards.length + 1,
      word,
      translation,
      tag: '',
      count: 0,
    };

    setCards([...cards, newCard]);
  };

  const restartApp = async () => {
    setSwipedRightCount(0);
    setSwipedLeftCount(0);
    setTotalSwipesRight(0);
    setProgress(0);
    AsyncStorage.removeItem('percentage');
    AsyncStorage.removeItem('totalSwipesRight');
    try {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM words;', [], result => {
          console.log('Table cleared successfully', result);
        });
      });

      const apiData: ApiData[] = await fetchDataFromAPI();
      const shuffledData = apiData.sort(() => Math.random() - 0.5);

      shuffledData.forEach(({word, translation}) => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
            [word, translation, '', 0],
            error => {
              console.log('Error inserting data: ', error);
            },
          );
        });
      });

      const cardDataArray: CardData[] = shuffledData.map((item, index) => ({
        id: index + 1,
        word: item.word,
        translation: item.translation,
        tag: '',
        count: 0,
      }));

      setCards(cardDataArray);

      fetchAndSetData();
    } catch (error) {
      console.error('Error restarting app:', error);
    }
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
          {progress < 100.0 ? (
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
              renderNoMoreCards={() => null}
            />
          ) : (
            <Fireworks />
          )}
          <View style={styles.buttonContainer}>
            <View>
              <CustomButton
                onPress={() => setShowConfirmationModal(true)}
                title={<Reload name="reload1" size={40} />}
                buttonColor="#c6c2f2"
                textColor="#fff6ee"
              />
            </View>

            {progress < 100.0 ? (
              <CustomButton
                onPress={() => setShowForm(true)}
                title={<Add name="add" size={40} />}
                buttonColor="#c6c2f2"
                textColor="#fff6ee"
              />
            ) : null}
          </View>

          <ModalAddForm
            visible={showForm}
            onClose={() => setShowForm(false)}
            onAddWord={handleAddWord}
          />
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
    width: '50%',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
});

export default SwipeCard;
