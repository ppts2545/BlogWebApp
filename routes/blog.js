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
    console.log('>>> Received POST /post-blog');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Session:', req.session);
    
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
router.post('/post-Bigblog', isLoggedIn, upload.fields([
    { name: 'file_MediaBigBlog', maxCount: 5 },
    { name: 'videoFile', maxCount: 2 }
]), (req, res) => {
    const { blogId, mainContent, youtubeLink } = req.body;
    const files = req.files;

    if (!blogId || !mainContent) {
        return res.status(400).json({ message: 'Missing content' });
    }

    const updateContent = 'UPDATE blog SET content = ? WHERE blog_id = ?';
    db.query(updateContent, [mainContent, blogId], (err) => {
        if (err) {
            console.error('❌ Error updating content:', err);
            return res.status(500).json({ message: 'Updating content failed' });
        }

        const mediaInserts = [];

        // Images
        if (files && files.file_MediaBigBlog) {
            files.file_MediaBigBlog.forEach(file => {
                const mediaType = mediaTypeUtils.identifyMediaType(file.originalname);
                mediaInserts.push([
                    blogId,
                    file.filename,
                    'images/' + file.filename,
                    false,
                    mediaType
                ]);
            });
        }

        // Videos
        if (files && files.videoFile) {
            files.videoFile.forEach(file => {
                const mediaType = mediaTypeUtils.identifyMediaType(file.originalname);
                mediaInserts.push([
                    blogId,
                    file.filename,
                    'videos/' + file.filename,
                    false,
                    mediaType
                ]);
            });
        }

        // YouTube link
        if (youtubeLink && youtubeLink.startsWith('http')) {
            mediaInserts.push([
                blogId,
                null,
                youtubeLink,
                false,
                'youtube'
            ]);
        }

        if (mediaInserts.length > 0) {
            const insertMedia = 'INSERT INTO media (blog_id, filename, filepath, is_thumbnail, media_type) VALUES ?';
            db.query(insertMedia, [mediaInserts], (err) => {
                if (err) {
                    console.error('❌ Error inserting media:', err);
                    return res.status(500).json({ message: 'Saving media failed' });
                }
                res.status(200).json({ message: 'Big blog updated successfully', blogId });
            });
        } else {
            // No media, just respond success
            res.status(200).json({ message: 'Big blog updated successfully', blogId });
        }
    });
});


// GET /load-post: Send all blog data as JSON
router.get('/load-post', (req, res) => {
    const currentUserId = req.session.user?.author_id || null;

    const query = `
        SELECT 
            b.blog_id,
            b.title,
            b.short_explain,
            author_id,
            created_at,
            updated_at,
            author_id,
            b.tags,
            b.content,
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
        res.json({ blogs: results, currentUserId });
    });
});

router.get('/render-blogs/:blogId', (req, res) => {
    const blogId = req.params.blogId;

    const blogQuery = 'SELECT * FROM blog WHERE blog_id = ?';
    const mediaQuery = 'SELECT filepath, media_type FROM media WHERE blog_id = ?';

    db.query(blogQuery, [blogId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('Blog not found');
        }

        const blog = results[0];

        db.query(mediaQuery, [blogId], (err, mediaResults) => {
            if (err) {
                return res.status(500).send('Error fetching media');
            }

            // Split media by type
            blog.images = mediaResults
                .filter(m => m.media_type === 'image')
                .map(m => '/' + m.filepath);

            blog.videos = mediaResults
                .filter(m => m.media_type === 'video' || m.media_type === 'youtube')
                .map(m => {
                    if (m.filepath.startsWith('http')) return m.filepath;
                    return '/' + m.filepath;
                });

            res.render('blog', { 
                blog,
                currentUserId: req.session.user?.author_id ?? null
            });
        });
    });
});


//Delete Blog
router.post('/delete-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    // ตรวจสอบว่าผู้ใช้ login และเป็นเจ้าของ blog หรือไม่
    const currentUserId = req.session.user?.author_id;

    if (!currentUserId) {
        return res.status(401).send('Unauthorized');
    }

    const getBlogQuery = 'SELECT author_id FROM blog WHERE blog_id = ?';
    db.query(getBlogQuery, [blogId], (err, results) => {
        if(err) return res.status(500).send('Database error');

        if(results.length === 0) {
            return res.status(404).send('Blog not found');
        }

        const blog = results[0];
        if(blog.author_id !== currentUserId) {
            return res.status(403).send('You are not allowed to delete this blog');
        }

        // ลบ blog ถ้าเป็นเจ้าของจริง
        const deleteMediaQuery = 'DELETE FROM media WHERE blog_id = ?';
        db.query(deleteMediaQuery, [blogId], (err, result) => {
            if (err){
                console.error('Delete error: ', err)
                return res.status(500).send('Error deleting blog');
            } 

            const deleteBlogQuery = 'DELETE FROM blog WHERE blog_id = ?'
            db.query(deleteBlogQuery, [blogId], (err) => {
                if(err) {
                    console.error('Error deleting blog: ', err);
                    return res.status(500).send('Error deleting blog');
                }
                
                return res.redirect('/');
            });
        });
    });
});

//EditForm Route
router.get('/edit-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;

    const blogQuery = 'SELECT * FROM blog WHERE blog_id = ?';
    const mediaQuery = 'SELECT filepath, media_type FROM media WHERE blog_id = ?';

    db.query(blogQuery, [blogId], (err, blogResults) => {
        if (err || blogResults.length === 0) {
            return res.status(404).send('ไม่พบบทความ');
        }

        const blog = blogResults[0];

        db.query(mediaQuery, [blogId], (err, mediaResults) => {
            if (err) return res.status(500).send('ดึงข้อมูลสื่อไม่สำเร็จ');

            res.render('editForm', {
                blog,
                media: mediaResults // ส่ง media ไปด้วย ถ้าจะแสดงในฟอร์ม
            });
        });
    });
});

//Update data Route
router.post('/update-blog/:blogId', upload.fields([
  { name: 'file_MediaBigBlog' },
  { name: 'videoFile' }
]), (req, res) => {
  const blogId = req.params.blogId;
  const { title, tag, short_explain, mainContent, youtubeLink } = req.body;

  // 1. อัปเดต blog
  const updateQuery = `
    UPDATE blog 
    SET title = ?, tags = ?, short_explain = ?, content = ?
    WHERE blog_id = ?
  `;
  db.query(updateQuery, [title, tag, short_explain, mainContent, blogId], (err) => {
    if (err){
        console.error('❌ Update Blog Error:', err);
        return res.status(500).send('❌ อัปเดตบทความไม่สำเร็จ');
    } 

    // 2. ลบ media เก่า
    const deleteMediaSQL = 'DELETE FROM media WHERE blog_id = ?';
    db.query(deleteMediaSQL, [blogId], (err) => {
      if (err) return res.status(500).send('❌ ลบ media เดิมไม่สำเร็จ');

      // 3. เตรียม media ใหม่
      const insertMediaSQL = `
        INSERT INTO media (blog_id, filename, filepath, caption, media_type)
        VALUES ?
      `;
      const mediaValues = [];

      // 3.1 รูปภาพ
      if (req.files['file_MediaBigBlog']) {
        req.files['file_MediaBigBlog'].forEach(file => {
          mediaValues.push([
            blogId,
            file.originalname,
            'uploads/' + file.filename,
            null,
            'image'
          ]);
        });
      }

      // 3.2 วิดีโอ
      if (req.files['videoFile']) {
        req.files['videoFile'].forEach(file => {
          mediaValues.push([
            blogId,
            file.originalname,
            'uploads/' + file.filename,
            null,
            'video'
          ]);
        });
      }

      // 3.3 YouTube Link
      if (youtubeLink) {
        const links = youtubeLink.split(/[\n,]/).map(link => link.trim()).filter(link => link !== '');
        links.forEach(link => {
          mediaValues.push([
            blogId,
            null,
            link,
            null,
            'youtube'
          ]);
        });
      }

      // 4. บันทึก media ถ้ามี
      if (mediaValues.length > 0) {
        db.query(insertMediaSQL, [mediaValues], (err) => {
          if (err) return res.status(500).send('❌ เพิ่ม media ใหม่ล้มเหลว');
          return res.redirect(`/render-blogs/${blogId}`);
        });
      } else {
        return res.redirect(`/render-blogs/${blogId}`);
      }
    });
  });
});



module.exports = router;
