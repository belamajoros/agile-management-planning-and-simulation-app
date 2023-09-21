import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import User from '../models/user';

const NAMESPACE = 'User';

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            if (users) {
                return res.status(200).json(users);
            } else {
                return res.status(404).json({message: "No record of User does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getAllUsers");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const getUserById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    User.findOne({ _id : id })
        .select('-password')
        .exec()
        .then((user) => {
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({message: "User with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getUserById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    User.findOneAndUpdate({ _id: id }, postData, { new : true })
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated.id);
            } else {
                return res.status(404).json({message: "User with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateUser");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    User.findOneAndDelete({ _id : id })
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "User deleted successfully!"});
            } else {
                return res.status(404).json({message: "User with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteUser");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getAllUsers, getUserById, updateUser, deleteUser };