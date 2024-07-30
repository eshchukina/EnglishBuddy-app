import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import SQLite from 'react-native-sqlite-2';
import SwipeCards from 'react-native-swipe-cards';
import NoMoreCards from './NoMoreCards';
import ModalAddForm from '../modal/ModalAddForm';
import Card from './Card';
import RadialProgress from './RadialProgress';
import Add from 'react-native-vector-icons/MaterialIcons';
import Fireworks from './Fireworks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reload from 'react-native-vector-icons/AntDesign';
import ModalRestart from '../modal/ModalRestart';
import {Dimensions} from 'react-native';
import CustomButton from '../buttons/CustomButton';
const db = SQLite.openDatabase('mydatabase.db');
import {heightPercentageToDP} from 'react-native-responsive-screen';
const {width: screenWidth} = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const SwipeCard = ({updateSwipedRightCount}) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [swipedRightCount, setSwipedRightCount] = useState(0);
  const [swipedLeftCount, setSwipedLeftCount] = useState(0);
  const [showNoMoreCards, setShowNoMoreCards] = useState(false);
  const [lastVisitedCardId, setLastVisitedCardId] = useState(null);
  const [countWithTagRight3, setCountWithTagRight3] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const visibilityDuration = 5000;

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, visibilityDuration);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowView(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const startButtonValue = AsyncStorage.getItem('startButton');

    if (startButtonValue && startButtonValue === '0') {
    } else if (startButtonValue && startButtonValue === '1') {
    }

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
      (tx, result) => {
        console.log('Table created successfully.');
      },
      error => {
        console.error('Error creating table:', error);
      },
    );
  });

  // db.transaction((tx) => {
  //   tx.executeSql(
  //     'ALTER TABLE words ADD COLUMN tag TEXT;',
  //     [],
  //     (tx, result) => {
  //       console.log('Column "tag" added successfully.');
  //     },
  //     (error) => {
  //       console.log('Error adding column "tag":', error);
  //     }
  //   );

  //   tx.executeSql(
  //     'ALTER TABLE words ADD COLUMN count INTEGER;',
  //     [],
  //     (tx, result) => {
  //       console.log('Column "count" added successfully.');
  //     },
  //     (error) => {
  //       console.log('Error adding column "count":', error);
  //     }
  //   );
  // });

  // useEffect(() => {
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

          apiData.forEach(({word, translation}) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
                [word, translation, '', 0],
                (tx, result) => {
                  // console.log("Data inserted successfully:", word, translation);
                },
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
              "SELECT COUNT(*) as count FROM words WHERE tag = 'right';",
              [],
       
              error => {
                console.log("Error with 'right' from SQLite:", error);
              },
            );
          });
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
                // console.log(shuffledData);

                setLoading(false);
              },
            );
          });

          db.transaction(tx => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM words;',
              [],
              (tx, result) => {
                const count = result.rows.item(0).count;
                setWordCount(count);
              },
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

        if (apiData.length > 0) {
          await AsyncStorage.setItem(
            'lastCardId',
            apiData[apiData.length - 1].id.toString(),
          );
        }
      } else {
        setDataSource('SQLite');
      }

      setTimeout(() => {
        setShowNoMoreCards(true);
      }, 30000);

      setLoading(false);
      const storedLastCardId = await AsyncStorage.getItem('lastCardId');

      if (storedLastCardId) {
        setLastVisitedCardId(parseInt(storedLastCardId, 10));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //   fetchAndSetData();
  // }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT COUNT(*) as count FROM words WHERE tag = 'right';",
        [],
      
        error => {
          console.log(error);
        },
      );
    });
  });

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

  const handleYup = card => {
    setSwipedRightCount(prevCount => prevCount + 1);

    AsyncStorage.setItem('lastCardId', card.id.toString());

    db.transaction(tx => {
      tx.executeSql(
        'SELECT count FROM words WHERE id = ?;',
        [card.id],
        (tx, result) => {
          const currentCount = result.rows.item(0).count || 0;
          tx.executeSql(
            "UPDATE words SET tag = 'right', count = ? WHERE id = ?;",
            [currentCount + 1, card.id],
            (tx, result) => {
              updateProgress();
            },
            error => {
              console.log('Error updating tag and count:', error);
            },
          );
        },
        error => {
          console.log('Error fetching count:', error);
        },
      );
    });
  };

  const handleNope = card => {
    setSwipedLeftCount(prevCount => prevCount + 1);

    AsyncStorage.setItem('lastCardId', card.id.toString());
    db.transaction(tx => {
      tx.executeSql(
        'SELECT count FROM words WHERE id = ?;',
        [card.id],
        (tx, result) => {
          const currentCount = result.rows.item(0).count || 0;
          tx.executeSql(
            "UPDATE words SET tag = 'left', count = ? WHERE id = ?;",
            [currentCount + 1, card.id],
            (tx, result) => {
              updateProgress();
            },
            error => {
              console.log('Error updating tag and count:', error);
            },
          );
        },
        error => {
          console.log('Error fetching count:', error);
        },
      );
    });
  };

  const updateProgress = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM words WHERE count >= 3;',
        [],
        (tx, result) => {
          const countWithTagRight3 = result.rows.item(0).count;
          setCountWithTagRight3(countWithTagRight3);
          updateSwipedRightCount(countWithTagRight3);
        },
        error => {
          console.log('Error updating progress:', error);
        },
      );
    });
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM words WHERE count >= 3;',
        [],
        (tx, result) => {
          const countWithTagRight3 = result.rows.item(0).count;
          setCountWithTagRight3(countWithTagRight3);
          // updateSwipedRightCount( countWithTagRight3);
        },
        error => {
          console.log('Error updating progress:', error);
        },
      );
    });
  }, [swipedRightCount, swipedLeftCount]);

  const handleAddWord = (word, translation) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
        [word, translation, '', 0],
        (tx, result) => {
          // console.log("Data inserted successfully:", word, translation, tag, count);
        },
        error => {
          console.log('Error inserting data: ', error);
        },
      );
    });

    const newCard = {id: cards.length + 1, word, translation};
    setCards([...cards, newCard]);
  };

  const restartApp = async () => {
    try {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM words;', [], (tx, result) => {
          console.log('Table cleared successfully');
        });
      });

      const apiData = await fetchDataFromAPI();

      const shuffledData = apiData.sort(() => Math.random() - 0.5);

      shuffledData.forEach(({word, translation}) => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO words (word, translation, tag, count) VALUES (?, ?, ?, ?);',
            [word, translation, '', 0],
            (tx, result) => {
              // console.log("Data inserted successfully:", word, translation);
            },
            error => {
              console.log('Error inserting data: ', error);
            },
          );
        });
      });

      setCards(shuffledData);
      setSwipedRightCount(0);
      setSwipedLeftCount(0);
      setLastVisitedCardId(null);
      setShowNoMoreCards(false);
      setCountWithTagRight3(0);
      updateSwipedRightCount(0);
      fetchAndSetData();

      if (apiData.length > 0) {
        await AsyncStorage.setItem(
          'lastCardId',
          apiData[apiData.length - 1].id.toString(),
        );
      }
    } catch (error) {
      console.error('Error restarting app:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Image
          source={require('../../assets/loading.gif')}
          style={{
            width: 100,
            height: 200,
            resizeMode: 'contain',
            alignItems: 'center',
          }}
        />
      ) : (
        <>
          <View style={styles.containerProgress}>
            <RadialProgress
              value={Math.round((countWithTagRight3 / wordCount) * 100)}
            />
          </View>
          {Math.round((countWithTagRight3 / wordCount) * 100) < 100 ? (
            <SwipeCards
              cards={cards}
              loop={true}
              onClickHandler={() => {}}
              showNope={false}
              showMaybe={false}
              showYup={false}
              renderCard={cardData => <Card {...cardData} />}
              handleYup={handleYup}
              handleNope={handleNope}
              hasMaybeAction={false}
              renderNoMoreCards={() =>
                showNoMoreCards ? <NoMoreCards /> : null
              }
              initialCardIndex={
                lastVisitedCardId
                  ? cards.findIndex(card => card.id === lastVisitedCardId)
                  : 0
              }
            />
          ) : (
            showView && <Fireworks />
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

            <View>
              {Math.round((countWithTagRight3 / wordCount) * 100) != 100 && (
                <CustomButton
                  onPress={() => setShowForm(true)}
                  title={<Add name="add" size={40} />}
                  buttonColor="#c6c2f2"
                  textColor="#fff6ee"
                />
              )}
            </View>
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
      <View>
        {loading && showView && (
          <CustomButton
            onPress={async () => {
              await AsyncStorage.setItem('startButton', '1');

              restartApp();
              fetchAndSetData();
            }}
            title="start"
            buttonColor="#c6c2f2"
            textColor="#fff6ee"
          />
        )}
      </View>
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
    width: '60%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 30,
  },
  button: {
    borderRadius: 15,
    margin: 10,
    padding: isSmallScreen ? heightPercentageToDP('1%') : 15,
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
    top: isSmallScreen ? heightPercentageToDP('30%') : 200,
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
  modalButton: {},
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
    color: 'green',
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
    color: 'red',
  },
});

export default SwipeCard;
