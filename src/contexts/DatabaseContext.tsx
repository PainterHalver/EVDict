import React, {createContext, useContext, useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {Buffer} from 'buffer';
import {Category, Word} from '../types';
import {decodeAv, filterBadChars, populateHtml} from '../utils/helpers';

export type DatabaseContextType = {
    db: SQLite.SQLiteDatabase | null;
    initFinished: boolean;
    getWord: (word: string) => Promise<Word | undefined>;
    getWordsStartsWith: (word: string, limit?: number) => Promise<Word[]>;
    getHistory: () => Promise<Word[]>;
    addHistoryWord: (word: Word) => Promise<void>;
    getCategories: () => Promise<Category[]>;
    addCategory: (name: string) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    editCategory: (id: number, name: string) => Promise<void>;
    getWordsFromCategory: (id: number) => Promise<Word[]>;
    getSelectedCategoryIds: (word: Word) => Promise<number[]>;
    addWordToCategories: (word: string, categoryIds: number[]) => Promise<void>;
    deleteWordsFromCategory: (word: string[], categoryId: number) => Promise<void>;
    getTodaysWord: () => Promise<Word | undefined>;
};

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DatabaseContext = createContext<DatabaseContextType>({
    db: null,
    initFinished: false,
    getWord: 0 as any,
    getWordsStartsWith: 0 as any,
    getHistory: 0 as any,
    addHistoryWord: 0 as any,
    getCategories: 0 as any,
    addCategory: 0 as any,
    deleteCategory: 0 as any,
    editCategory: 0 as any,
    getWordsFromCategory: 0 as any,
    getSelectedCategoryIds: 0 as any,
    addWordToCategories: 0 as any,
    deleteWordsFromCategory: 0 as any,
    getTodaysWord: 0 as any,
});

export const DatabaseProvider = ({children}: any) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [initFinished, setInitFinished] = useState(false);

    const createTables = async () => {
        try {
            if (!db) throw new Error('App database is not ready');

            // Bảng lịch sử
            await db.executeSql(
                `CREATE TABLE IF NOT EXISTS word_history (
                    word TEXT PRIMARY KEY NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
            );
            console.log("CREATED TABLE 'word_history'");

            // Bảng category
            await db.executeSql(
                `CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
            );
            console.log("CREATED TABLE 'categories'");

            // Thêm sẵn 1 category
            await db.executeSql(`INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'Từ vựng quan trọng')`);

            // Bảng nối từ vựng và category
            await db.executeSql(
                `CREATE TABLE IF NOT EXISTS word_categories (
                    word TEXT NOT NULL,
                    category_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id)
                )`,
            );
            console.log("CREATED TABLE 'word_categories'");
        } catch (error) {
            console.log('CREATE TABLES ERROR: ', error);
        }
    };

    const getCategories = async (): Promise<Category[]> => {
        try {
            if (!db) throw new Error('App database is not ready');

            const rs = await db.executeSql(`
                SELECT categories.*, COUNT(word_categories.category_id) as count FROM categories
                LEFT JOIN word_categories ON word_categories.category_id = categories.id
                GROUP BY categories.id
            `);
            const categories = rs[0].rows.raw();
            return categories;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const addCategory = async (name: string): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            await db.executeSql(`INSERT INTO categories (name) VALUES (?)`, [name]);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCategory = async (id: number): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            await db.executeSql(`DELETE FROM categories WHERE id = ?`, [id]);
        } catch (error) {
            console.log(error);
        }
    };

    const editCategory = async (id: number, name: string): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            await db.executeSql(`UPDATE categories SET name = ? WHERE id = ?`, [name, id]);
        } catch (error) {
            console.log(error);
        }
    };

    const getWordsFromCategory = async (categoryId: number, limit: number = 100): Promise<Word[]> => {
        try {
            if (!db) throw new Error('App database is not ready');

            const rs = await db.executeSql(
                `SELECT * FROM word_categories
                LEFT JOIN av ON av.word = word_categories.word 
                WHERE category_id = ? ORDER BY created_at LIMIT ?`,
                [categoryId, limit],
            );
            const words = rs[0].rows.raw();
            decodeAv(words);
            return words;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    /**
     * Trả về array category_id mà trong category đó có từ này, vì một từ có thể thuộc nhiều category
     */
    const getSelectedCategoryIds = async (word: Word): Promise<number[]> => {
        try {
            if (!db) throw new Error('App database is not ready');

            const rs = await db.executeSql(`SELECT * FROM word_categories WHERE word = ?`, [word.word]);
            const categories = rs[0].rows.raw();
            return categories.map((category: any) => category.category_id);
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const addWordToCategories = async (word: string, categoryIds: number[]): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            await db.transaction(tx => {
                // Remove all current categories
                tx.executeSql(`DELETE FROM word_categories WHERE word = ?`, [word]);

                categoryIds.forEach(categoryId => {
                    tx.executeSql(`INSERT INTO word_categories (word, category_id) VALUES (?, ?)`, [word, categoryId]);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteWordsFromCategory = async (words: string[], categoryId: number): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            await db.executeSql(
                `
                DELETE FROM word_categories WHERE word IN (${words.map(() => '?').join(',')}) AND category_id = ?`,
                [...words, categoryId],
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getTodaysWord = async (): Promise<Word | undefined> => {
        try {
            if (!db) throw new Error('App database is not ready');

            // Lấy tất cả số lượng từ
            const rs = await db.executeSql(`SELECT COUNT(*) as count FROM av`);
            const total = rs[0].rows.raw()[0].count;

            // Lấy một từ bất kỳ dùng ngày hôm nay làm seed
            // https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format
            const date = new Date();
            const datePadded = ('0' + date.getDate()).slice(-2);
            const monthPadded = ('0' + (date.getMonth() + 1)).slice(-2); // getMonth bắt đầu từ 0 ??
            const seed = Number(`${date.getFullYear()}${monthPadded}${datePadded}`);
            console.log('SEED: ', seed);
            const random = Math.floor((seed * 133773) % total);

            const rs2 = await db.executeSql(`SELECT * FROM av LIMIT 1 OFFSET ?`, [random]);
            const word = rs2[0].rows.raw()[0];
            word.av = new Buffer(word.av, 'base64').toString('utf8');
            word.av = populateHtml(word.av);
            return word;
        } catch (error) {
            console.log(error);
        }
    };

    const getWord = async (word: string): Promise<Word | undefined> => {
        try {
            if (!db) throw new Error('Data database is not ready');

            word = filterBadChars(word);
            console.log(word);
            const result = await new Promise<Word | undefined>(async (resolve, reject) => {
                await db.transaction(tx => {
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
            if (!db) throw new Error('Data database is not ready');

            const result = await new Promise<Word[]>(async (resolve, reject) => {
                await db.transaction(tx => {
                    tx.executeSql(
                        `SELECT word, mean, av FROM av WHERE word LIKE ? ORDER BY word ASC LIMIT ?`,
                        [query + '%', limit],
                        (_, rs) => {
                            if (rs.rows.length > 0) {
                                try {
                                    // return all rows after converting to array
                                    const rows = rs.rows.raw();
                                    decodeAv(rows);
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
            if (!db) throw new Error('App database is not ready');

            const rs = await db.executeSql(`
                SELECT * FROM word_history 
                JOIN av ON av.word = word_history.word
                ORDER BY created_at DESC LIMIT 100
            `);
            const rows = rs[0].rows.raw();
            decodeAv(rows);
            return rows;
        } catch (error) {
            console.log('GET HISTORY:', error);
            return [];
        }
    };

    const addHistoryWord = async (word: Word): Promise<void> => {
        try {
            if (!db) throw new Error('App database is not ready');

            // Xóa dòng cũ đi nếu có và tạo dòng mới, tiện đỡ phải lọc trùng
            await db.executeSql('INSERT OR REPLACE INTO word_history (word) VALUES (?)', [word.word]);
        } catch (error) {
            console.log('ADD HISTORY WORD:', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setDb(
                    await SQLite.openDatabase({
                        name: 'av.db',
                        createFromLocation: '~av_all_v3.db',
                    }),
                );
            } catch (error) {
                console.log('USE EFFECT:', error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (db) {
                await createTables();
                setInitFinished(true);
            }
        })();
    }, [db]);

    return (
        <DatabaseContext.Provider
            value={{
                db,
                initFinished,
                getWord,
                getWordsStartsWith,
                addHistoryWord,
                getHistory,
                getCategories,
                addCategory,
                deleteCategory,
                editCategory,
                getWordsFromCategory,
                getSelectedCategoryIds,
                addWordToCategories,
                deleteWordsFromCategory,
                getTodaysWord,
            }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
