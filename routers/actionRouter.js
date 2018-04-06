const express = require('express');

const router = express.Router();

const db = require('./../data/helpers/actionModel.js');

router.get('/', (req, res) => {
    db
    .get()
    .then(actions => {
        res.json(actions);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retrieving actions"});
    })
})

router.get('/:id', (req, res) => {

    const { id } = req.params;

    db
    .get(id)
    .then(action => {
        res.json(action);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retrieving the user"});
    })
})

router.post('/', (req, res) => {
    const { project_id, description, notes, completed } = req.body;
    const newAct = { project_id, description, notes, completed };

    if (!newAct.project_id || !newAct.description) res.status(400).json({errorMessage: "Please include an id and description"});
    else if(newAct.description.length > 128) res.status(400).json({errorMessage: "Max char count for a desciption is 128"});
    else {
        db
        .insert(newAct)
        .then(response => {
            res.json(newAct);
        })
        .catch(error => {
            res.status(500).json({error: "There was an error adding the action"});
        })
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { project_id, description, notes, completed } = req.body;
    const actUpdate = { project_id, description, notes, completed };

    db
    .update(id, actUpdate)
    .then(response => {
        if (response === null) res.status(404).json({error: "That action does not exist"});
        else {
            db.get(id)
            .then(act => {
                res.json(act);
            })
            .catch(error => {
                res.status(500).json({error: "There was an error retrieving the action"});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error: "There was an error updating the action"});
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db
    .remove(id)
    .then(response => {
        if (response < 1) res.status(404).json({error: "That action does not exist"});
        else {
            db
            .get()
            .then(resp => {
                res.json(resp);
            })
            .catch(error => {
                res.status(500).json({error: "There was an error retrieving action list"});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error: "There was an error deleting the action"});
    })
})

module.exports = router;
