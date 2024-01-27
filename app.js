const express = require('express');
const app = express();
const fs = require('fs');

let news = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readData = () => {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        news = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

const saveData = () => {
    fs.writeFileSync('noticias.json', JSON.stringify(news, null, 2));
}

app.get('/', (req, res) => {
    res.send('Welcome to the news application!');
});

app.get('/noticias', (req, res) => {
    readData();
    res.json(news);
});

app.get('/noticias/:id', (req, res) => {
    readData();
    const id = req.params.id;
    const indexNews = news.find(noticia => noticia.id == id);

    if (indexNews) {
        res.json(indexNews);
    } else {
        res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
});

app.post('/noticias', (req, res) => {
    readData();
    const breakingNews = {
        id: news.length + 1,
        ...req.body
    };
    news.push(breakingNews);
    saveData();
    res.redirect('/noticias');
});

app.delete('/noticias/:id', (req, res) => {
    readData();
    const id = req.params.id;
    const indexNews = news.findIndex(noticia => noticia.id == id);

    if (indexNews !== -1) {
        const eliminatedNews = news.splice(indexNews, 1);
        saveData();
        res.json({ mensaje: 'Noticia eliminada exitosamente', eliminada: eliminatedNews });
    } else {
        res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
});

app.listen(3001, () => {
    console.log(`Express está escuchando en http://localhost:3001`);
});
