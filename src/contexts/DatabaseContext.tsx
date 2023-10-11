import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { Buffer } from 'buffer';
import { Word } from '../types';

export type DatabaseContextType = {
    db: SQLite.SQLiteDatabase | null;
    getWord: (word: string) => Promise<Word | undefined>;
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
});

export const DatabaseProvider = ({ children }: any) => {
    const getWord = async (word: string): Promise<Word | undefined> => {
        try {
            const result = await new Promise<Word | undefined>(
                async (resolve, reject) => {
                    await db.transaction((tx: any) => {
                        tx.executeSql(
                            `SELECT * FROM av WHERE word = ?`,
                            [word],
                            (_: any, rs: any) => {
                                if (rs.rows.length > 0) {
                                    try {
                                        const row = rs.rows.item(0);
                                        // Vì lý do nào đó khi lấy data nó lại trả về base64
                                        row.av = new Buffer(row.av, 'base64').toString('utf8');
                                        row.av = (row.av as string)
                                            .replace(/<d1/g, '<div class="')
                                            .replace(/<a1/g, '<a href="')
                                            .replace(/<s1/g, '<span class="')
                                            .replace(/<d3>/g, '</div></div></div>')
                                            .replace(/<s2>/g, '</span></span>');

                                        resolve(row);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    resolve(undefined);
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
        <DatabaseContext.Provider value={{ db, getWord }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);