// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());
const port = 8000;

// GET main site page
server.get('/', (req, res) => {
    try {
        const now = new Date().toISOString();
        res.send(`Welcome to my app. The time is: ${now}`);
    }
    catch(err) {
        res.status(500).json({ message: 'There was a problem retrieving the page'})
    }
});

// GET all users
server.get('/users', async (req, res) => {
    try {
        const users = await db.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: 'The users information could not be retrieved',
            err
        });
    }
});

//GET a particular user
server.get('/users/:id', async (req, res) => {
    try {
        const user = await db.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    } catch (err) {
        res.status(500).json({
            message: 'There was an error retrieving the user',
            err
        });
    }
});

// POST add a user
server.post('/users', async (req, res) => {
    try {
        const { name, bio } = req.body;
        if (!name || !bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user.'
            });
        }
        if (name && bio) {
            const newUser = await db.insert({ name, bio });
            res.status(201).json({
                message: 'User successfully added to database',
                newUser
            });
        }
    } catch (error) {
        console.error('There was a problem adding user to database:', error);
    }
});

// PUT update user
server.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, bio } = req.body;
        const updatedUser = await db.update(id, { name, bio });
        if (updatedUser) {
            res.status(200).json();
        }
        if (!updatedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
        if (!name || !bio) {
            res.status(400).json({ message: "Please provide name and bio for the user." })
        }
    } catch (err) {
        res.status(500).json({
            message: 'There was an error updating user',
            err
        });
    }
});

// DELETE remove user
server.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await db.remove(id);
        if (deletedUser) {
            res.status(204).json({ message: 'The user was removed' });
        }
        if (!deletedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    } catch (err) {
        res.status(500).json({ message: 'There was an error deleting user' });
    }
});

server.listen(`${port}`, () => {
    console.error(`Server is running on port ${port}`);
});
