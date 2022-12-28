const express = require('express')
const dotenv = require('dotenv');
const userRoutes = require('./route/users/usersRoute');
const postRoutes = require('./route/posts/postRoute');
const commentRoutes = require('./route/comments/commentRoute');

const { errorHandler, notFound } = require('./middlewares/error/errorHandler');

dotenv.config();
const dbConnect = require('./config/db/dbConnect');

const app = express();
// dbConnect
dbConnect();

// Middleware
app.use(express.json())

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// errorHandler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running1 ${PORT}`))
// db pass: SE3QKbbfgD79qGAY