import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { Buffer } from 'buffer';
import { Word } from '../types';
import { populateHtml } from '../utils/helpers';

export type DatabaseContextType = {
    db: SQLite.SQLiteDatabase | null;
    getWord: (word: string) => Promise<Word | undefined>;
    getWordsStartsWith: (word: string) => Promise<Word[] | undefined>;
};

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
const db = SQLite.openDatabase(
    {
        name: 'av',
        createFromLocation: '~av_all_v3.db',
    },
    () => {
        console.log('DB OPENED');
    },
    (error: any) => {
        console.log('OPEN DB ERROR:', error);
    },
);

const DatabaseContext = createContext<DatabaseContextType>({
    db: db,
    getWord: async (word: string) => {
        return {} as any;
    },
    getWordsStartsWith: async (word: string) => {
        return [] as any;
    },
});

export const DatabaseProvider = ({ children }: any) => {
    const getWord = async (word: string): Promise<Word | undefined> => {
        try {
            const result = await new Promise<Word | undefined>(
                async (resolve, reject) => {
                    await db.transaction((tx: any) => {
                        tx.executeSql(
                            `SELECT * FROM av WHERE word = ? LIMIT 1`,
                            [word],
                            (_: any, rs: any) => {
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
                            (_: any, error: any) => reject(error),
                        );
                    });
                },
            );
            return result;
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const getWordsStartsWith = async (
        query: string,
        limit: number = 5,
    ): Promise<Word[] | undefined> => {
        try {
            const result = await new Promise<Word[] | undefined>(
                async (resolve, reject) => {
                    await db.transaction(tx => {
                        tx.executeSql(
                            `SELECT word, mean, av FROM av WHERE word LIKE ? LIMIT ?`,
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
                            (_: any, error: any) => reject(error),
                        );
                    });
                },
            );
            return result;
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    return (
        <DatabaseContext.Provider value={{ db, getWord, getWordsStartsWith }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);