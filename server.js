const express = require('express');
const productRoutes = require('./routes/productRoutes');
const getDatabase = require('./config/database');
const cors = require('cors');

const app = express()

app.use(express.json()) //Body parser

// app.use(productRoutes);

app.use("/api/product", productRoutes);
//app.use("/api/user",userRoutes);
app.use(cors());
// add middleware & static files

let db = getDatabase();
const PORT = process.env.PORT || 5000        // Define the PORT

//listen to requests
app.listen(PORT, ()=>{
   console.log(`Server listening on port ${PORT}`)
})
