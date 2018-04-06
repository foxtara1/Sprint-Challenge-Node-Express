const express = require('express');

const router = express.Router();

const db = require('./../data/helpers/projectModel.js');

router.get('/', (req, res) => {
    db
    .get()
    .then(projects => {
        res.json(projects);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retrieving projects"});
    })
})

router.get('/:id', (req, res) => {

    const { id } = req.params;

    db
    .get(id)
    .then(project => {
        res.json(project);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retrieving the project"});
    })
})

router.get('/project_actions/:id', (req, res) => {

    const { id } = req.params;

    db
    .getProjectActions(id)
    .then(response => {
        res.json(response);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retriving the Project Action List"});
    })
})

router.post('/', (req, res) => {
    const { name, description, completed } = req.body;
    const newProj = { name, description, completed };

    if (!newProj.name || !newProj.description) res.status(400).json({errorMessage: "Please include a name and description"});
    else if(newProj.name.length > 128 || newProj.description.length > 128) res.status(400).json({errorMessage: "Max char count for a name or desciption is 128"});
    else {
        db
        .insert(newProj)
        .then(response => {
            res.json(newProj);
        })
        .catch(error => {
            res.status(500).json({error: "There was an error adding the project"});
        })
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;
    const projUpdate = { name, description, completed };

    db
    .update(id, projUpdate)
    .then(response => {
        if (response === null) res.status(404).json({error: "That project does not exist"});
        else {
            db.get(id)
            .then(proj => {
                res.json(proj);
            })
            .catch(error => {
                res.status(500).json({error: "There was an error retrieving the project"});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error: "There was an error updating the project"});
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db
    .remove(id)
    .then(response => {
        if (response < 1) res.status(404).json({error: "That project does not exist"});
        else {
            db
            .get()
            .then(resp => {
                res.json(resp);
            })
            .catch(error => {
                res.status(500).json({error: "There was an error retrieving projects"});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error: "There was an error deleting the project"});
    })
})

module.exports = router;