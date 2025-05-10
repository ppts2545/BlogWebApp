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
        
        const authorId = req.session.user.author_id;
    
        if (!file || !title || !tag || !short_explain || !authorId) {
            return res.status(400).json({ message: 'Missing data' });
        }

        const filename = file.filename;
        const filepath = 'images/' + filename;

        const saveBlog = 'INSERT INTO blog (title, short_explain, tags, author_id) VALUES (?, ?, ?, ?)';
        const saveImage = 'INSERT INTO media (blog_id, filename, filepath, is_thumbnail) VALUES (?, ?, ?, ?)';

        db.query(saveBlog, [title, short_explain, tag, authorId], (err, blogResult) => {
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

router.get('/load-post', (req, res) => {
    const query = `
       SELECT 
        blog.blog_id,
        blog.title,
        blog.short_explain,
        blog.tags,
        blog.author_id,
        media.filepath AS thumbnail
    FROM blog
    LEFT JOIN media ON blog.blog_id = media.blog_id AND media.is_thumbnail = true
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('❌ Error loading blog posts with media:', err);
            return res.status(500).json({ error: 'Failed to load blog posts' });
        }
        res.json(result);
    });
});

module.exports = router;