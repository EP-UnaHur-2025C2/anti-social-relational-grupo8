console.log("UnaHur - Anti-Social net");

const express = require('express');
const app = express();
const db = require('./db/models');

// --- Importación de Rutas ---
const userRouter = require('./routes/userRoutes');
const tagRouter = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followerRoutes = require('./routes/followerRoutes');

// Middlewares Globales
app.use(express.json())

app.use('/user', userRouter);
app.use('/post', postRoutes);
app.use('/tag', tagRouter);
app.use('/comment', commentRoutes);
app.use(`/followers`, followerRoutes);

const PORT = 3000

app.listen(PORT, async () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
    //await db.sequelize.sync({ force: true });

})
