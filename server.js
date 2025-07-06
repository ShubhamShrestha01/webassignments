/*********************************************************************************
*  WEB322 – Assignment 04
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  Name: Shubham Shrestha   Student ID: 109303230   Date: 07/06
*
*  Published URL: webassignments-bgeoho75m-shubham-shresthas-projects-a82c99ca.vercel.app
*
********************************************************************************/
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

// Load data
const projects = JSON.parse(fs.readFileSync('./data/projectData.json'));
const sectors = JSON.parse(fs.readFileSync('./data/sectorData.json'));

// Routes
app.get('/', (req, res) => res.render('index', { page: '/' }));
app.get('/about', (req, res) => res.render('about', { page: '/about' }));

app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;
  let filtered = projects;

  if (sector) {
    const s = sectors.find(x => x.name === sector);
    if (s) {
      filtered = projects.filter(p => p.sector_id == s.id);
      if (filtered.length === 0) {
        return res.status(404).render('404', { message: 'No projects found for this sector.', page: '' });
      }
    } else {
      return res.status(404).render('404', { message: 'Sector not found.', page: '' });
    }
  }
  res.render('projects', { projects: filtered, page: '/solutions/projects' });
});

app.get('/solutions/projects/:id', (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (project) {
    res.render('project', { project: project, page: '' });
  } else {
    res.status(404).render('404', { message: 'Project not found.', page: '' });
  }
});

app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found.', page: '' });
});

app.listen(HTTP_PORT, () => console.log(`Server listening on: http://localhost:${HTTP_PORT}`));

