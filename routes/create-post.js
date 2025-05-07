const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const multer = require('multer');
const { isLoggedIn } = require('../routes/login-registerSystem.js')

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
    '/post-blog',
        isLoggedIn,
        upload.single('imageProfileBlog'),
        (req, res) => {
        const { title, tag, short_explain } = req.body;
        const file = req.file;
        const userId = req.session.user?.id; // Get author ID from session
    
        if (!file || !title || !tag || !short_explain || !userId) {
            return res.status(400).json({ message: 'Missing data' });
        }

        const filename = file.filename;
        const filepath = 'images/' + filename;

        const saveImage = 'INSERT INTO images (filename, filepath) VALUES (?, ?)';
        const saveBlog = 'INSERT INTO posts (title, images, short_explain, tags, author_id) VALUES (?, ?, ?, ?, ?)';

        db.query(saveImage, [filename, filepath], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Image save failed' });
            }

            db.query(saveBlog, [title, filepath, short_explain, tag, userId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Blog save failed' });
                }

                res.status(200).json({ message: 'Blog saved successfully' });
            });
        });
});

router.get('/load-post', (req, res) => {
    db.query('SELECT * FROM posts', (err, result) => {
        if(err){
            console.error('❌ Error load POST data:', err);
            return res.status(500).json({ error: 'Failed to load Post from database' });
        }
        res.json(result);
    });
});

module.exports = router;