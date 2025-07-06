/*********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  Name: Shubham Shrestha   Student ID: 109303230   Date: 07/06
*
*  Published URL: 
*
********************************************************************************/

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();


app.use(express.static('public'));


const projects = JSON.parse(fs.readFileSync('./data/projectData.json', 'utf8'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});


app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/solutions/projects', (req, res) => {
  const sector = req.query.sector;

  if (sector) {
    const filtered = projects.filter(p => p.sector === sector);
    if (filtered.length > 0) {
      res.json(filtered);
    } else {
      res.status(404).send('No projects found for this sector.');
    }
  } else {
    res.json(projects);
  }
});


app.get('/solutions/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);

  if (project) {
    res.json(project);
  } else {
    res.status(404).send('Project not found.');
  }
});


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});


const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`);
});
