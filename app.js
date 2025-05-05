const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const loadImage = require('./routes/upload-image');
const user = require('./routes/login-registerSystem');
const session = require('express-session');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', loadImage);
app.use('/', user);


// Set EJS as template engines
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index'); 
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})