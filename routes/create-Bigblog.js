const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const multer = require('multer');
const { isLoggedIn } = require('../routes/login-registerSystem.js');

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
    '/post-Bigblog',
        isLoggedIn,
        upload.array('imageProfileBlog', 10),
        (req, res) => {
        const { mainContent } = req.body;
        const files = req.files;
        
        const authorId = req.session.user.author_id;
    
        if (!files || files.length === 0 || !mainContent || !authorId) {
            return res.status(400).json({ message: 'Missing data' });
        }

        const filename = file.filename;
        const filepath = 'images/' + filename;

        const saveBlog = 'INSERT INTO blog (content, author_id) VALUES (?, ?)';
        const saveImage = 'INSERT INTO media (blog_id, filename, filepath, is_thumbnail) VALUES (?, ?, ?, ?)';

        db.query(saveBlog, [mainContent, authorId], (err, blogResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Blog save failed' });
            }

            const blogId = blogResult.insertId;
            
            db.query(saveImage, [blogId, filename, filepath, true], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Image save failed' });
                }

                res.status(200).json({ message: 'Blog saved successfully' });
            });
        });
});