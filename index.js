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

  app.get('/', (request, responce) =>{
    responce.render('index');
  })

  app.get('/routes/:id', (request, responce) => {
    const cont = request.params.id;
    responce.send(`id.parameter -- ${cont}`);
  })

  app.get('/some', (request, responce) => {
    responce.send('<h3>jojo</h3>');
  })

  app.get('/retrieve', (request, responce) => {
    const inp = [];
    responce.render('posts/scr', { inp });
  })

  app.post('/retrieve', (request, responce) => {
    const { id } = request.body;
    responce.send(`--|| ${id} ||--`);
  })

  app.get('/posts', (request, responce) => {
    const form = [];
    responce.render('posts/form', { form });
  })
    
  app.post('/posts', (request, responce) => {
    const { name, gender, email, country } = request.body;
    const query = 'INSERT INTO citizens (name, gender, email, country) VALUES ($1, $2, $3, $4)';
    const values = [name, gender, email, country];

    pool
      .query(query, values)
      .then(results => responce.send(`note was added <a href='/'>back to main page`))
      .catch(error => console.error('note does not was added'))
  })

  app.get('/screen', (request, responce) => {
    pool
      .query('SELECT * FROM citizens')
      .then(results => {
        const list = results.rows;
        responce.render('posts/screen', { list });    
      })
      .catch(error => console.error('the page cannot be displayed'))
  })

  app.get('/del', (request, responce) => {
    const note = [];
    responce.render('posts/delete', { note });        
  })

  app.post('/del', (request, responce) => {
    const { name } = request.body;
    const data = [name];
    const query = 'DELETE FROM citizens WHERE name = $1';        

    pool
      .query(query, data)
      .then(results => responce.send(`note by name ${name} was deleted <a href='/'> back to main page`))
      .catch(error => console.error('the note cannot be removed'))    
  })

  return app;
};

