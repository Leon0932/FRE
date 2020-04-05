const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const helmet = require('helmet'); // Disable express headers
const cors = require('cors'); // Limits requests from only specified clients
const rateLimit = require('express-rate-limit'); // Limits requests per IP
const morgan = require('morgan'); // Shows all request in the console

const mongoose = require('mongoose');

const passport = require('passport');
const authConfig = require('./auth-config');
const session = require('express-session');

const app = express();

// DB Connection
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('Database connected'))
	.catch((err) => console.log(err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 100, // 100 reqs / 15 mins / IP
});
app.use(limiter);
app.use(morgan('combined'));

app.use(
	session({
		name: 'session-id',
		secret: 'secret',
		saveUninitialized: false,
		resave: false,
		cookie: {
			expires: 600000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
authConfig(passport);

const auth = require('./routes/auth');
const users = require('./routes/users');
// Routes
app.use('/api/', auth);
app.use('/api/users/', users);

// Route not found
app.use((req, res) => {
	const error = new Error(`${req.originalUrl} - Not found`);
	res.status(404);
	res.json({ error: error.message });
});

// Default 500 Error
// app.use((req, res, error) => {
// 	const error = new Error(error);
// 	res.status(500).json({ error });
// });

// Run server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}.`));
