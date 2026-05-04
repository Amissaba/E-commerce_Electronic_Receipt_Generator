require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3300
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(express.json())

app.get("/", (req,res)=>{
    res.status(200).json({
        message: "Welcome to E-commerce_Electroni_Receipt_Generator API"
    })
})

app.use("/api/v1/admin", require('./src/routes/adminRoutes'))
app.use("/api/v1/customer", require('./src/routes/customerRoutes'))
app.use("/api/v1/product", require('./src/routes/productRoutes'))
app.use("/api/v1/order", require('./src/routes/orderRoutes'))

app.use("/", (req,res)=>{
    res.status(404).json({
        message: err.message ||"An error occured"
    })

})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})