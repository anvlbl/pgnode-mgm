import Express from 'express';
import bodyParser from 'body-parser';

import pgTools from 'pg';
const { Pool } = pgTools;

import dbSet from './dbconfig.js';
    
export default () => {    
    const pool = new Pool(dbSet);
    const app = new Express();    

    app.set('view engine', 'pug');

    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', (req, res) =>{
        res.render('index');
    })

    app.get('/routes/:id', (req, res) => {
        const cont = req.params.id;
        res.send(`id.parameter -- ${cont}`);
    })

    app.get('/some', (req, res) => {
        res.send('<h3>jojo</h3>');
    })

    app.get('/posts', (req, res) => {
        const form = [];
        res.render('posts/form', { form });
    })

    app.post('/posts', (req, res) => {
        const { name, gender, email, country } = req.body;
        const query = 'INSERT INTO citizens (name, gender, email, country) VALUES ($1, $2, $3, $4)';
        const values = [name, gender, email, country];
        pool.query(query, values, (error, results) => {
            if(error) {
                throw new Error('note does not was added')
            }
            res.send(`note was added <a href='/'>back to main page`);
        })
    })

    app.get('/screen', (req, res) => {
        pool.query('SELECT * FROM citizens', (error, results) => {
            if (error) {
                throw error
            }
            const list = results.rows;
            const length = list.length;
            res.render('posts/screen', { list });            
        })
    })

    app.get('/show', (req, res) => {
        pool.query('SELECT * FROM citizens', (error, results) => {
            if (error) {
                throw error
            }
            res.send(results.rows);
        })
    })

    return app;
};
