const express = require('express')
const app = express()
const port = 3000

const userRoute = require('../routers/user')

app.use(express.json())
app.use('/user', userRoute);

app.listen(port, function(){
    console.log(`App running at port ${port}`);
})