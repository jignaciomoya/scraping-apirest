const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

app.get(`/`, async (req, res) => {
    try {
        const url = 'https://elpais.com/ultimas-noticias/';
        const response = await axios.get(url)
        const html = response.data;
        const $ = cheerio.load(html);

        const newsClass = $('.b-st_a article.c.c-d.c--m');

        let news = [];

        newsClass.each((index, element) => {
            const titulo = $(element).find('header.c_h').text();
            const imagenes = $(element).find('img').attr('src');
            const descripcion = $(element).find('p.c_d').text();
            const enlace = $(element).find('a').attr('href');

            const article = {
                id: news.length + 1,
                titulo: titulo,
                imagen: imagenes,
                descripcion: descripcion,
                enlace: enlace,
            };
            news.push(article); // Fixed typo here (singlesNews to singleNews)
        });

        res.send('Datos guardados en noticias.json');

        fs.writeFileSync('noticias.json', JSON.stringify(news, null, 2)); // Fixed typo here (noticias to news)

    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log(`Express está escuchando en http://localhost:3000`);
});
