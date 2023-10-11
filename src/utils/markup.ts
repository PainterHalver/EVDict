import { Word } from '../types';
import cssText from './dic_light';

export const createMarkup = (word: Word | undefined) => {
    if (!word) {
        return '';
    }

    const html = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
            ${cssText}
            </style>
        </head>
        <body>
            ${word.av}
        </body>
        </html>
    `;
    return html;
};