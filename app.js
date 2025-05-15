const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const session = require('express-session');

const blogRoutes = require('./routes/blog');
const userRoute = require('./routes/login-registerSystem').router;

app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static('public'));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', userRoute);
app.use('/', blogRoutes);

// Serve static files (uploaded images, CSS, JS)
app.use('/uploads', express.static('uploads'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

app.get('/open-blog', (req, res) => {
    res.render("blog")
})

app.get('/', (req, res) => {
    res.render("index", { user: req.session.user });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});