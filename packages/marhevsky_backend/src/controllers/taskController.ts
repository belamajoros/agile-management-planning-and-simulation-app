import {NextFunction, Request, Response} from "express";
import logging from "../config/logging";
import mongoose from "mongoose";
import Task from "../models/task";

const NAMESPACE = 'Task';

const getTasks = (req: Request, res: Response, next: NextFunction) => {
    Task.find()
        .exec()
        .then((tasks) => {
            if (tasks) {
                return res.status(200).json(tasks);
            } else {
                return res.status(404).json({message: "No record of Category does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getTasks");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postTask = (req: Request, res: Response, next: NextFunction) => {
    let { title, description, priority, estimation, category, creator } = req.body;
    const _worker = new Task({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        priority,
        estimation,
        category,
        creator
    });

    logging.info(NAMESPACE, description);

    return _worker
        .save()
        .then((task) => {
            return res.status(201).json(task);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postTask");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getTaskById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Task.findOne({ _id : id })
        .exec()
        .then((task) => {
            if (task) {
                return res.status(200).json(task);
            } else {
                return res.status(404).json({message: "Category with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getTaskById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateTask = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    Task.findOneAndUpdate({_id: id}, postData,
        { new : true })
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Task with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateTask");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteTask = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Task.findOneAndDelete({_id : id})
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Task deleted successfully!"});
            } else {
                return res.status(404).json({message: "Task with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteTask");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getTasks, postTask, getTaskById, deleteTask, updateTask };