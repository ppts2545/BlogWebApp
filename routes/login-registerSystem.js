const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../config/db');
const path = require('path');


//Set Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function blockIfLoggedIn (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next()
}

function isLoggedIn (req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login?message=You must log in to create a post');
    }
}

router.get('/login', blockIfLoggedIn, (req, res) => {
    const message = req.query.message;
    res.render('login', { message });
})

router.get('/register', blockIfLoggedIn, (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            //Check email already existed
            res.render('register', {error_msg: 'Email already registered. Please use a different email.'})
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES(?, ?, ?)'

            db.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
                if (err) throw err;
                res.render('register', { success_msg: 'Registeration successfully!'})
            })
        }
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err){
            console.error(err);
            return res.status(500).render('login', { error_msg: 'Database error. Please try again later.' });
        } 

        if (Array.isArray(result) && result.length > 0) {
            const user = result[0];

            if (user.password && bcrypt.compareSync(password, user.password)) {
                req.session.user = {
                    author_id: user.id ?? 0,  // Use the right field name here
                    name: user.name ?? 'Guest',
                    email: user.email ?? 'no-email@example.com'
                };
                return res.redirect('/');
            } else {
                return res.render('login', { error_msg: 'Incorrect password!' });
            }
        } else {
            return res.render('login', { error_msg: 'User not found!' });
        }
    })
});


module.exports = {
    router,
    blockIfLoggedIn,
    isLoggedIn
}; 