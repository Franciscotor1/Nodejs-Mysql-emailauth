import express from 'express';
import path from 'path';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import router from './routes/usuarioRoutes.js';
import db from './config/db.js'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

async function connectToDatabase() {
    try {
        await db.sync();
        console.log('Conexión correcta a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

connectToDatabase();

const __dirname = path.resolve();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
