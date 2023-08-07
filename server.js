const express = require('express');
const session = require('express-session');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const getDatabase = require('./config/database');
const crypto = require('crypto');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const app = express()
app.use(cors());

let db = getDatabase();
const secretKey = crypto.randomBytes(64).toString('hex');
app.use(
   session({
     secret: secretKey,
     resave: false,
     saveUninitialized: true,
     cookie: {
       secure: true,
       maxAge: 86400000,
     },
     store: new MongoStore({
      mongooseConnection: db,
      collection: 'sessions' }),
   })
 );
// add middleware & static files
app.use(express.json()) //Body parser
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000        // Define the PORT

//listen to requests
app.listen(PORT, ()=>{
   console.log(`Server listening on port ${PORT}`)
})
