const express = require('express');
const productRoutes = require('./routes/productRoutes');
const getDatabase = require('./config/database');
const cors = require('cors');

const app = express()
// add middleware & static files
app.use(express.json()) //Body parser
app.use("/api/product", productRoutes);
//app.use("/api/user",userRoutes);
app.use(cors());
let db = getDatabase();
const PORT = process.env.PORT || 5000        // Define the PORT

//listen to requests
app.listen(PORT, ()=>{
   console.log(`Server listening on port ${PORT}`)
})
