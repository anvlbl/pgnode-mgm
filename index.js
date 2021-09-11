import Express, { request, response } from 'express';
import bodyParser from 'body-parser';
import pgTools from 'pg';
const { Pool } = pgTools;

import knex from './dbconfig/knex.js';
import dbSet from './dbconfig/dbconfig.js';
    
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
  
  //retrieve is area for testing new features

  app.get('/retrieve', (request, responce) => {
    const inp = [];
    responce.render('posts/scr', { inp });
  })

  app.post('/retrieve', (request, responce) => {
    const { id, type } = request.body;
    responce.send(`text- ${id} || flag- ${type}`);
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
      .then(resolve => responce.send(`note was added <a href='/'>back to main page`))
      .catch(error => console.error('note does not was added'))
  })

  app.get('/screen', (request, responce) => {
    pool
      .query('SELECT * FROM citizens')
      .then(resolve => {
        const list = resolve.rows;
        responce.status(200).render('posts/screen', { list });    
      })
      .catch(error => console.error('the page cannot be displayed'))
  })

  app.get('/del', (request, responce) => {
    const note = [];
    responce.render('posts/delete', { note });        
  })

  app.post('/del', (request, responce) => {
    const { input, type } = request.body;
    const data = [input];

    const queries = {      
      id: 'DELETE FROM citizens WHERE id = $1',
      name: 'DELETE FROM citizens WHERE name = $1',
    };

    pool
      .query(queries[type], data)
      .then(resolve => responce.send(`note by ${type} ${input} was removed <a href='/'> back to main page`))
      .catch(error => console.error('the note cannot be removed'))    
  })

  app.get('/update', (request, responce) => {
    const note = [];
    responce.render('posts/update', { note });
  })

  app.post('/update', (request, responce) => {
    const { id, country } = request.body;
    const data = [id, country];
    const queryString = 'UPDATE citizens SET country = $2 WHERE id = $1';

    pool
      .query(queryString, data)
      .then(resolve => responce.send(`entry was updated`))
      .catch(error => console.error('entry not updated, and app crashed'))
  })

  app.get('/knexdata', async (request, response) => {
    const data1 = await knex.select().from('citizens').where('id', 14);    
    response.send(data1);
  })
  
  return app;
};
