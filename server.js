const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cors({
  origin: 'http://localhost:4000', 
  methods: ['GET', 'POST',],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const loginRoute = require('./routes/login.route');
const signupRoute = require('./routes/signup.route');
const apiRoute = require('./routes/api.route');
const classtagRoute = require('./routes/classtag.route');

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/api', apiRoute);
app.use('/classtag', classtagRoute);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT);
});
