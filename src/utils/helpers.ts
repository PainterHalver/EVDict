import Tts from 'react-native-tts';
import {Word} from '../types';
import {Buffer} from 'buffer';
import {ToastAndroid} from 'react-native';

/**
 * Giải nén html từ db
 */
export const populateHtml = (html: string) => {
    return html
        .replace(/<d1/g, '<div class="')
        .replace(/<a1/g, '<a href="')
        .replace(/<s1/g, '<span class="')
        .replace(/<d3>/g, '</div></div></div>')
        .replace(/<s2>/g, '</span></span>');
};

/**
 * Lọc các ký tự xấu khi tìm kiếm
 */
export const filterBadChars = (word: string) => {
    const badChars = ['\\', '/', ':', '*', '?', '"', '>', '<', '|', ';', ',', '.'];
    word = word
        .split('')
        .filter(char => !badChars.includes(char))
        .join('');
    // replace - chỉ khi không phải là ký tự cuối (path-)
    return word
        .replace(/-(?=[a-zA-Z0-9]+($|\s))/g, ' ')
        .replace(/_/g, ' ')
        .trim();
};

/**
 * Decode base64 av từ db
 * Trong db vẫn lưu dạng blob, khi lấy ra thì thư viện lại trả về base64
 */
export const decodeAv = (rows: Word[]) => {
    rows.forEach((row: Word) => {
        row.av = new Buffer(row.av, 'base64').toString('utf8');
        row.av = populateHtml(row.av);
    });
};

/**
 * Phát âm từ
 */
export const speak = async (text: string, lang: 'US' | 'UK') => {
    try {
        if (!text) return;
        await Tts.stop();
        await Tts.setDefaultVoice(lang === 'UK' ? 'en-GB-language' : 'en-US-language');
        Tts.speak(text);
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
    }
};
