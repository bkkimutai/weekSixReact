const express = require('express');
const session = require('express-session');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const getDatabase = require('./config/database');
const crypto = require('crypto');
const cors = require('cors');
const app = express()
app.use(cors());
const secretKey = crypto.randomBytes(64).toString('hex');
app.use(
   session({
     secret: secretKey, // Replace with your secret key
     resave: false,
     saveUninitialized: true,
     cookie: {
       secure: true, // Set to true if using HTTPS
       maxAge: 86400000, // Set the session timeout in milliseconds (e.g., 24 hours)
     },
   })
 );
// add middleware & static files
app.use(express.json()) //Body parser
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

let db = getDatabase();
const PORT = process.env.PORT || 5000        // Define the PORT

//listen to requests
app.listen(PORT, ()=>{
   console.log(`Server listening on port ${PORT}`)
})
