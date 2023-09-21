import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import logging from "../config/logging";
import signJWT from "../functions/signJWT";
import User from "../models/user";

const NAMESPACE = 'Auth';


const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const createUserWithId = (req: Request, res: Response, next: NextFunction) => {
    let {id,email} = req.body;
    const new_id = new mongoose.Types.ObjectId(id)
    const _user = new User({
        _id: new_id,
        email: email
    });

    User.find({_id: new_id})
        .exec()
        .then((users) => {
            console.log(users)
            if (users.length !== 0) {
                return res.status(401).json({
                    message: 'User with this ID already exists'
                });
            } else {
                return _user
                        .save()
                        .then((user) => {
                            return res.status(201).json({message: 'User created'});
                        })
                        .catch((error) => {
                            logging.info(NAMESPACE, "Error in creating user");
                            return res.status(500).json({
                                message: error.message,
                                error
                            });
                        });
            }
        });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let {email, username, password} = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            username: username,
            password: hash,
        });
        logging.info(NAMESPACE, hash);

        User.find({email})
            .exec()
            .then((users) => {
                if (users.length !== 0) {
                    return res.status(401).json({
                        message: 'Email address is already in use.'
                    });
                } else {
                    return _user
                        .save()
                        .then((user) => {
                            return res.status(201).json({message: 'User created'});
                        })
                        .catch((error) => {
                            logging.info(NAMESPACE, "Error in catch register");
                            return res.status(500).json({
                                message: error.message,
                                error
                            });
                        });
                }
            });
    });
};
const login = (req: Request, res: Response, next: NextFunction) => {
    let {email, password} = req.body;

    User.find({email})
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'User with this email does not exist'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (!result) {
                    return res.status(401).json({
                        message: 'Incorrect password'
                    });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token
                            });
                        }
                    });
                }
            });
        })
        .catch((err) => {
            logging.info(NAMESPACE, "Error in catch login" + err);
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export default {validateToken, register, login, createUserWithId};