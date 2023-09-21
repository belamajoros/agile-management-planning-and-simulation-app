import {NextFunction, Request, Response} from "express";
import logging from "../config/logging";
import mongoose from "mongoose";
import Worker from "../models/worker";

const NAMESPACE = 'Worker';

const getWorkers = (req: Request, res: Response, next: NextFunction) => {
    Worker.find()
        .exec()
        .then((workers) => {
            if (workers) {
                return res.status(200).json(workers);
            } else {
                return res.status(404).json({message: "No record of Worker does exist."});
            }        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getWorkers");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postWorker = (req: Request, res: Response, next: NextFunction) => {
    let { name, description, talents, creator } = req.body;
    const _worker = new Worker({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        talents,
        creator
    });

    logging.info(NAMESPACE, name);

    return _worker
        .save()
        .then((worker) => {
            return res.status(201).json(worker);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postWorker");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getWorkerById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Worker.findOne({ _id: id })
        .exec()
        .then((worker) => {
            if (worker) {
                return res.status(200).json(worker);
            } else {
                return res.status(404).json({message: "Worker with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getWorkerById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateWorker = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    Worker.findOneAndUpdate({ _id: id }, postData, { new : true })
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Worker with id:" + id +" does not exist."});
            }        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateWorker");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteWorker = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Worker.findOneAndDelete({_id : id})
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Worker deleted successfully!"});
            } else {
                return res.status(404).json({message: "Worker with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteWorker");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getWorkers, postWorker, getWorkerById, updateWorker, deleteWorker };