import React, {createContext, useContext, useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {Buffer} from 'buffer';
import {Word} from '../types';
import {filterBadChars, populateHtml} from '../utils/helpers';

export type DatabaseContextType = {
    getWord: (word: string) => Promise<Word | undefined>;
    getWordsStartsWith: (word: string, limit?: number) => Promise<Word[]>;
    getHistory: () => Promise<Word[]>;
    addHistoryWord: (word: Word) => Promise<void>;
};

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DatabaseContext = createContext<DatabaseContextType>({
    getWord: 0 as any,
    getWordsStartsWith: 0 as any,
    getHistory: 0 as any,
    addHistoryWord: 0 as any,
});

export const DatabaseProvider = ({children}: any) => {
    const [dataDb, setDataDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase | null>(null);

    const createTables = async () => {
        try {
            if (!appDb) throw new Error('App database is not ready');

            await appDb.executeSql(
                `CREATE TABLE IF NOT EXISTS word_history (
          word TEXT PRIMARY KEY NOT NULL,
          mean TEXT NOT NULL,
          av TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
            );
            console.log("CREATED TABLE 'word_history'");
        } catch (error) {
            console.log('CREATE TABLES ERROR: ', error);
        }
    };

    const getWord = async (word: string): Promise<Word | undefined> => {
        try {
            if (!dataDb) throw new Error('Data database is not ready');

            word = filterBadChars(word);
            console.log(word);
            const result = await new Promise<Word | undefined>(async (resolve, reject) => {
                await dataDb.transaction(tx => {
                    tx.executeSql(
                        `SELECT * FROM av WHERE word = ? LIMIT 1`,
                        [word],
                        (_, rs) => {
                            if (rs.rows.length > 0) {
                                try {
                                    const row = rs.rows.item(0);
                                    // Vì lý do nào đó khi lấy data nó lại trả về base64
                                    row.av = new Buffer(row.av, 'base64').toString('utf8');
                                    row.av = populateHtml(row.av);

                                    resolve(row);
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                reject('Không có gì trả về');
                            }
                        },
                        (_, error) => reject(error),
                    );
                });
            });
            return result;
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const getWordsStartsWith = async (query: string, limit: number = 5): Promise<Word[]> => {
        try {
            if (!dataDb) throw new Error('Data database is not ready');

            const result = await new Promise<Word[]>(async (resolve, reject) => {
                await dataDb.transaction(tx => {
                    tx.executeSql(
                        `SELECT word, mean, av FROM av WHERE word LIKE ? ORDER BY word ASC LIMIT ?`,
                        [query + '%', limit],
                        (_, rs) => {
                            if (rs.rows.length > 0) {
                                try {
                                    // return all rows after converting to array
                                    const rows = rs.rows.raw();
                                    rows.forEach((row: Word) => {
                                        row.av = new Buffer(row.av, 'base64').toString('utf8');
                                        row.av = populateHtml(row.av);
                                    });
                                    resolve(rows);
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                reject('Không có gì trả về');
                            }
                        },
                        (_, error) => reject(error),
                    );
                });
            });
            return result;
        } catch (error) {
            console.log('ERROR: ', error);
            return [];
        }
    };

    const getHistory = async (): Promise<Word[]> => {
        try {
            if (!appDb) throw new Error('App database is not ready');

            const rs = await appDb.executeSql('SELECT * FROM word_history ORDER BY created_at DESC LIMIT 100');
            const rows = rs[0].rows.raw();
            return rows;
        } catch (error) {
            console.log('GET HISTORY:', error);
            return [];
        }
    };

    const addHistoryWord = async (word: Word): Promise<void> => {
        try {
            if (!appDb) throw new Error('App database is not ready');

            await appDb.executeSql('INSERT OR REPLACE INTO word_history (word, mean, av) VALUES (?, ?, ?)', [
                word.word,
                word.mean,
                word.av,
            ]);
        } catch (error) {
            console.log('ADD HISTORY WORD:', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setDataDb(
                    await SQLite.openDatabase({
                        name: 'av.db',
                        createFromLocation: '~av_all_v3.db',
                    }),
                );
                setAppDb(
                    await SQLite.openDatabase({
                        name: 'app.db',
                        location: 'default',
                    }),
                );
            } catch (error) {
                console.log('USE EFFECT:', error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (appDb) {
                await createTables();
            }
        })();
    }, [appDb]);

    return (
        <DatabaseContext.Provider value={{getWord, getWordsStartsWith, addHistoryWord, getHistory}}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
