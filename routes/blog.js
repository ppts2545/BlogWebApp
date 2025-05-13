const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../config/db');
const { isLoggedIn } = require('../routes/login-registerSystem.js');
const mediaTypeUtils = require('../public/js/identify_Type_Media.js');

// Storage config for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /post-blog: Handle thumbnail blog creation
router.post('/post-blog', isLoggedIn, upload.single('imageProfileBlog'), (req, res) => {
    const { title, tag, short_explain } = req.body;
    const file = req.file;
    const authorId = req.session.user.author_id;

    if (!file || !title || !tag || !short_explain || !authorId) {
        return res.status(400).json({ message: 'Missing data' });
    }

    const filename = file.filename;
    const filepath = 'images/' + filename;

    // Identify media type using the mediaTypeUtils
    const mediaType = mediaTypeUtils.identifyMediaType(file.originalname);  // If it's a file
    console.log('Detected Media Type:', mediaType);

    const saveBlog = 'INSERT INTO blog (title, short_explain, tags, author_id) VALUES (?, ?, ?, ?)';
    const saveImage = 'INSERT INTO media (blog_id, filename, filepath, is_thumbnail, media_type) VALUES (?, ?, ?, ?, ?)';

    db.query(saveBlog, [title, short_explain, tag, authorId], (err, blogResult) => {
        if (err) return res.status(500).json({ message: 'Blog save failed' });

        const blogId = blogResult.insertId;

        db.query(saveImage, [blogId, filename, filepath, true, mediaType], (err) => {
            if (err) return res.status(500).json({ message: 'Image save failed' });

            res.status(200).json({ message: 'Blog saved successfully', blogId });
        });
    });
});

// GET /write-big-blog/:blogId – render big blog writing page
router.get('/write-big-blog/:blogId', isLoggedIn, (req, res) => {
    const blogId = req.params.blogId;
    res.render('bigBlogForm', { blogId });
});

// POST /post-Bigblog: handle big blog content submission
router.post('/post-Bigblog', isLoggedIn, upload.array('file_MediaBigBlog'), (req, res) => {
    const { blogId, mainContent } = req.body;
    const files = req.files;

    if (!blogId || !mainContent) {
        return res.status(400).json({ message: 'Missing content' });
    }

    const saveMainContent = 'INSERT INTO blog_detail (blog_id, content) VALUES (?, ?)';
    db.query(saveMainContent, [blogId, mainContent], (err) => {
        if (err) return res.status(500).json({ message: 'Saving content failed' });

        if (files && files.length > 0) {
            const insertMedia = 'INSERT INTO media (blog_id, filename, filepath, is_thumbnail) VALUES ?';
            const mediaValues = files.map(file => [
                blogId,
                file.filename,
                'images/' + file.filename,
                false
            ]);

            db.query(insertMedia, [mediaValues], (err) => {
                if (err) return res.status(500).json({ message: 'Saving media failed' });
                res.status(200).json({ message: 'Big blog saved' });
            });
        } else {
            res.status(200).json({ message: 'Big blog saved without media' });
        }
    });
});

// GET /load-post: Send all blog data as JSON
router.get('/load-post', (req, res) => {
    const query = `
        SELECT 
            b.blog_id,
            b.title,
            b.short_explain,
            b.tags,
            m.filepath AS thumbnail
        FROM blog b
        LEFT JOIN media m ON b.blog_id = m.blog_id AND m.is_thumbnail = true
        ORDER BY b.blog_id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error loading blog data' });
        }
        res.json(results);
    });
});


module.exports = router;
