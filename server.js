const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const actionRouter = require('./routers/actionRouter.js');
const projectRouter = require('./routers/projectRouter.js');
const port = 5000;
const server = express();

server.use(express.json())

const logger = (req, res, next) => {
    console.log(`Requested URL: ${req.url}`);
    console.log(`Request Info: ${req.body}`);
    next();
}

server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.listen(port, () => console.log(`API running on Port:${port}`));