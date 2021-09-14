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

  app.get('/', (request, response) =>{
    response.render('index');
  })

  app.get('/routes/:id', (request, response) => {
    const cont = request.params.id;
    response.send(`id.parameter -- ${cont}`);
  })
  
  //retrieve is area for testing new features

  app.get('/retrieve', (request, response) => {
    const inp = [];
    response.render('posts/scr', { inp });
  })

  app.post('/retrieve', (request, response) => {
    const { id, type } = request.body;
    response.send(`text- ${id} || flag- ${type}`);
  })
  
  // app.get('/posts', (request, response) => {
  //   const form = [];
  //   response.render('posts/form', { form });
  // })
    
  // app.post('/posts', (request, response) => {
  //   const { name, gender, email, country } = request.body;
  //   const query = 'INSERT INTO citizens (name, gender, email, country) VALUES ($1, $2, $3, $4)';
  //   const values = [name, gender, email, country];

  //   pool
  //     .query(query, values)
  //     .then(resolve => response.send(`note was added <a href='/'>back to main page`))
  //     .catch(error => console.error('note does not was added'))
  // })

  app.route('/posts')
    .get((request, response) => {
      const form = [];
      response.render('posts/form', { form });      
    })
    .post((request, response) => {
      const { name, gender, email, country } = request.body;
      const query = 'INSERT INTO citizens (name, gender, email, country) VALUES ($1, $2, $3, $4)';
      const values = [name, gender, email, country];

      pool
        .query(query, values)
        .then(resolve => response.send(`note was added <a href='/'>back to main page`))
        .catch(error => console.error('note does not was added'))
    })

  app.get('/screen', (request, response) => {
    pool
      .query('SELECT * FROM citizens')
      .then(resolve => {
        const list = resolve.rows;
        response.status(200).render('posts/screen', { list });    
      })
      .catch(error => console.error('the page cannot be displayed'))
  })

  app.get('/del', (request, response) => {
    const note = [];
    response.render('posts/delete', { note });        
  })

  app.post('/del', (request, response) => {
    const { input, type } = request.body;
    const data = [input];

    const queries = {      
      id: 'DELETE FROM citizens WHERE id = $1',
      name: 'DELETE FROM citizens WHERE name = $1',
    };

    pool
      .query(queries[type], data)
      .then(resolve => response.send(`note by ${type} ${input} was removed <a href='/'> back to main page`))
      .catch(error => console.error('the note cannot be removed'))    
  })

  app.get('/update', (request, response) => {
    const note = [];
    response.render('posts/update', { note });
  })

  app.post('/update', (request, response) => {
    const { id, country } = request.body;
    const data = [id, country];
    const queryString = 'UPDATE citizens SET country = $2 WHERE id = $1';

    pool
      .query(queryString, data)
      .then(resolve => response.send(`entry was updated`))
      .catch(error => console.error('entry not updated, and app crashed'))
  })

  app.get('/knex', async (request, response) => {
    const data = await knex.select().from('citizens').where('country', 'China').limit(5);   
    console.log(data); 
    response.send(data);
  })
  
  app.get('/pg', async (request, response) => {
    const data = await pool.query('SELECT * FROM citizens LIMIT 5 OFFSET 5');
    const list = data.rows;            
    response.json(list);
  })

  return app;
};
