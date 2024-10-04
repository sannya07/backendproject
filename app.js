const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const doctorRoutes = require('./routes/doctorRoutes'); // Adjust path as needed
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/authApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set up EJS
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Session & Flash Middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());

app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);

// Set global variables for messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.get('/', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { doctors: [] }); // Ensure doctors is always defined
});

// Handle Signup Form
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/signup');
    }

    user = new User({ username, email, password });
    await user.save();
    req.flash('success_msg', 'You are registered and can log in');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/signup');
  }
});

// Handle Login Form
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'No user found with this email');
      return res.redirect('/');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/');
    }

    req.flash('success_msg', 'Login successful');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Route to book appointments
app.post('/book-appointment', async (req, res) => {
  const disease = req.body.disease;

  // Find doctors who treat the specified disease
  try {
    const doctors = await Doctor.find({ diseases: disease });
    res.render('dashboard', { doctors }); // Render the dashboard with the list of suggested doctors
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching doctors');
    res.redirect('/dashboard');
  }
});
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));
  

// Use doctor routes
app.use('/', doctorRoutes); // Use the doctor routes

// Listen on the specified PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

