const path = require('path')
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const db = require('../config/db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const index = Date.now();
        const originalExtension = file.originalname.split('.').pop();
        cb(null, 'file-' + index + '.' + originalExtension)
    }
})

const upload = multer({storage: storage});

router.post('/photos/upload', upload.array('photos', 10), function (req, res, next) {
    if(!req.files || req.files.length === 0){
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const insertPromises = req.files.map(file => {
        const filename = file.filename;
        const filepath = 'images/' + filename;

        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO images (filename, filepath) VALUES (?,?)',
                [filename, filepath],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    });
    Promise.all(insertPromises)
        .then(() => {
            res.status(200).json({ message: 'Files uploaded and saved to database'});
        })
        .catch(err => {
            console.error('❌ Error saving to database:', err);
            res.status(500).json({ error: 'Upload succeeded but DB insert failed' });
        })
});

router.get('/image-list', (req, res) => {
    db.query('SELECT * FROM images ORDER BY uploaded_at DESC', (err, results) => {
        if(err) {
            console.error('❌ Error fetching images from DB:', err);
            return res.status(500).json({ error: 'Failed to fetch images from database' });
        }
        res.json(results);
    });
});

module.exports = router;