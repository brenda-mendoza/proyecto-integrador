import express from 'express';
import config from './config.js';
import routerProducts from './router/products.js';
import multer from 'multer';
import path from 'path';
import url from 'url';

const app = express();

app.use(express.static('public', {extensions: ['html', 'htm']}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img'),
    filename: (req, file, cb) => {
        cb (null, new Date().getTime() + path.extname(file.originalname));
    }
});

export function currDir(fileUrl) {
    const __filename = url.fileURLToPath(fileUrl);
    return path.dirname(__filename);
}

app.use(multer({storage}).single('image-product'));

app.use('/api/products', routerProducts);



const PORT = config.PORT

const server = app.listen(PORT, () => console.log(`Conectado con el puerto ${PORT}.`));
server.on('error', error => console.log('Error al iniciar express' + error.message));