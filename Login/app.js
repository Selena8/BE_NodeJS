const express = require('express')
const app = express()
app.use(express.json())

// Require user route
// const userRoute = require('./users/route')
const authRoute = require('./routes/auth')
// Dùng userRoute cho tất cả các route bắt đầu bằng '/users', '/auth'
// app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

const port = 5000
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})