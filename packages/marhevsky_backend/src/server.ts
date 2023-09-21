import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/config';
import logging from './config/logging';

//ROUTES
import * as fs from 'fs';
import * as https from 'https';
import path from "path";
import extractJWT from "./middleware/extractJWT";
import authRoutes from './routes/auth';
import backlogRoutes from './routes/backlog';
import categoryRoutes from './routes/category';
import jwtRoute from './routes/jwt';
import projectRoutes from './routes/project';
import talentRoutes from './routes/talent';
import taskRoutes from './routes/task';
import userRoutes from './routes/user';
import workerRoutes from './routes/worker';

const NAMESPACE = 'Server';
const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

router.use(cors({
    origin: ['http://localhost:9000','http://localhost:3001'],
    optionsSuccessStatus: 200
  }));

/** Body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes*/
router.use('/auth', authRoutes);
router.use('/jwt', jwtRoute);
router.use('/user', extractJWT, userRoutes);
router.use('/category', extractJWT, categoryRoutes);
router.use('/talent', extractJWT, talentRoutes);
router.use('/worker', extractJWT, workerRoutes);
router.use('/task', extractJWT, taskRoutes);
router.use('/backlog', extractJWT, backlogRoutes);
router.use('/project', extractJWT, projectRoutes);


/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const https_options = {
    key: fs.readFileSync(path.join(__dirname, './resources/access_token/private.key')),
    cert: fs.readFileSync(path.join(__dirname, './resources/server.crt')),
};

// const httpServer = https.createServer(https_options, router);
const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));