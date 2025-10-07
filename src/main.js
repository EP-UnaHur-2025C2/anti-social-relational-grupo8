console.log("UnaHur - Anti-Social net");

const express = require('express')
const db = require('./db/models')
const userRouter = require('./routes/userRoutes')
const app = express()

app.use(express.json())

app.use('/user', userRouter)

const PORT = 3000

app.listen(PORT, async () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
    //await db.sequelize.sync({ force: true });

})
