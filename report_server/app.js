const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 9001;

app.use(express.json());

const FILENAME = 'reports.txt';

// Tạo file nếu chưa tồn tại
fs.open(path.join(__dirname, FILENAME), 'a', err => {
    if (err) throw err;
});

app.post('/report', (req, res) => {
    const report = req.body.report;
    const word = req.body.word;
    if (!report || !word) {
        res.status(400).send('Thiếu dữ liệu');
        return;
    }

    console.log(`[+] ${word}##${report}`);

    fs.appendFile(path.join(__dirname, 'reports.txt'), `${word}##${report}\n`, err => {
        if (err) {
            res.status(500).send('Thêm report thất bại');
        } else {
            res.status(200).send('Thêm report thành công');
        }
    });
});

app.get('/report', (req, res) => {
    res.set({'content-type': 'text/plain; charset=utf-8'});
    fs.createReadStream(path.join(__dirname, 'reports.txt')).pipe(res);
});

app.listen(port, () => {
    console.log(`Server mở trên port ${port}...`);
});
