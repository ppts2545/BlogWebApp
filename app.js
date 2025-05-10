const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const userRoute = require('./routes/login-registerSystem').router;
const session = require('express-session');
const createBlog = require('./routes/create-post');
const createBigBlog = require('./routes/create-Bigblog');

app.set('view engine', 'ejs');
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
app.use('/', userRoute);
app.use('/', createBlog);


app.get('/open-blog', (req, res) => {
    res.render("blog")
})

app.get('/', (req, res) => {
    res.render("index", { user: req.session.user });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});