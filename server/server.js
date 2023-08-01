const express = require('express');
const app =  express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
app.use(express.json());

const usersRoute = require('./routes/useresRoute');
const moviesRoute = require('./routes/moviesRoute');
const theatreRoute = require('./routes/theatresRoute');
const bookingsRoute = require('./routes/bookingsRoute');

app.use('/api/users', usersRoute);
app.use('/api/movies', moviesRoute);
app.use('/api/theatres',theatreRoute );    
app.use('/api/bookings', bookingsRoute);

const port = process.env.port || 5500;

app.listen(port, () => console.log(`server listening on port ${port}`));