import {Word} from '../types';
import cssText from './dic_light';

export const createMarkup = (word: Word | undefined) => {
    if (!word) {
        return '';
    }

    // Cho những từ link đến từ khác (VD: tampered link tới tamper)
    // Những từ này sẽ không có trường av và mean sẽ có dạng @tamper
    const meanWithoutAtSign = word.mean.replace('@', '');
    // Jadx line ~141, cùng hàm với hàm lấy blob, file DicWordAV_DB, tìm string `Xem từ gốc`
    const emptyAvMarkup = `
      <div class="m5t">
      <div class="p10l ovf">
        <div>
            <div class="w fl">${word.word}</div>
            <div class="p5l fl"></div>
        </div>
      </div>
      <div>
        <div class="p10">
            <div id="part_Qu">
              <div class="im"><span>Xem từ gốc </span><a href="${meanWithoutAtSign}">${meanWithoutAtSign}</a></div>
            </div>
        </div>
      </div>
    `;

    const html = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
            ${cssText}
            </style>
        </head>
        <body>
            <div>
                ${word.av || emptyAvMarkup}
            </div>
            <script>
                const anchors = document.getElementsByTagName('a');
                for (let i = 0; i < anchors.length; i++) {
                    anchors[i].addEventListener('click', (e) => {
                        e.preventDefault();
                        window.ReactNativeWebView.postMessage(anchors[i].textContent.trim());
                    });
                }
            </script>
        </body>
        </html>
    `;
    return html;
};
