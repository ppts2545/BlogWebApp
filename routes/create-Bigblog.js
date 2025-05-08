const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const multer = require('multer');


// setup diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.post(
    '/create-Bigblog',
        upload.single('imageBigBlog'),
        (req, res) => {
        const { mainContent } = req.body;

        const filename = file.filename;
        const filepath = 'images/' + filename;

        const saveImage = 'INSERT INTO images (filename, filepath) VALUES (?, ?)';
        const saveBigBlog = 'INSERT INTO blog (content) VALUES (?)';

        db.query(saveImage, [filename, filepath], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Image save failed' });
            }

            db.query(saveBigBlog, [mainContent], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Blog save failed' });
                }

                res.status(200).json({ message: 'Blog saved successfully' });
            });
        });
});



module.exports = router;