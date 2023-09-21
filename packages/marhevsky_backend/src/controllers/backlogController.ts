import {NextFunction, Request, Response} from "express";
import logging from "../config/logging";
import mongoose from "mongoose";
import Backlog from "../models/backlog";

const NAMESPACE = 'Backlog';

const getBacklogs = (req: Request, res: Response, next: NextFunction) => {
    Backlog.find()
        .exec()
        .then((backlogs) => {
            if (backlogs) {
                return res.status(200).json(backlogs);
            } else {
                return res.status(404).json({message: "No record of Backlog does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getBacklog");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postBacklog = (req: Request, res: Response, next: NextFunction) => {
    let { task, worker, progress, sprintNo } = req.body;
    const _backlog = new Backlog({
        _id: new mongoose.Types.ObjectId(),
        task,
        worker,
        progress,
        sprintNo
    });
    logging.info(NAMESPACE, task);

    return _backlog
        .save()
        .then((backlog) => {
            return res.status(201).json(backlog);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postBacklog");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const getBacklogById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Backlog.findOne({ _id : id })
        .exec()
        .then((backlog) => {
            if (backlog) {
                return res.status(200).json(backlog);
            } else {
                return res.status(404).json({message: "Backlog with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getBacklogById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateBacklog = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    Backlog.findByIdAndUpdate(id, postData, { new: true })
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Backlog with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateBacklog");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteBacklog = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Backlog.findOneAndDelete({ _id : id })
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Backlog deleted successfully!"});
            } else {
                return res.status(404).json({message: "Backlog with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteBacklog");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getBacklogs, getBacklogById, postBacklog, updateBacklog, deleteBacklog };