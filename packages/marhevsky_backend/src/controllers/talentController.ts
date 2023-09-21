import {NextFunction, Request, Response} from "express";
import logging from "../config/logging";
import mongoose from "mongoose";
import Talent from "../models/talent";

const NAMESPACE = 'Talent';

const getTalents = (req: Request, res: Response, next: NextFunction) => {
    Talent.find()
        .exec()
        .then((talents) => {
            if (talents) {
                return res.status(200).json(talents);
            } else {
                return res.status(404).json({message: "No record of Talent does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getTalents");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postTalent = (req: Request, res: Response, next: NextFunction) => {
    let { name, description, buff_value, category, creator } = req.body;
    const _talent = new Talent({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        buff_value,
        category,
        creator
    });

    logging.info(NAMESPACE, name);

    return _talent
        .save()
        .then((talent) => {
            return res.status(201).json(talent);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postTalent");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getTalentById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Talent.findOne({ _id : id })
        .exec()
        .then((talent) => {
            if (talent) {
                return res.status(200).json(talent);
            } else {
                return res.status(404).json({message: "Talent with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getTalentById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateTalent = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    Talent.findOneAndUpdate({ _id: id }, postData,{ new : true })
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Talent with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateTalent");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteTalent = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    Talent.findOneAndDelete({_id: id})
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Talent deleted successfully!"});
            } else {
                return res.status(404).json({message: "Talent with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteTalent");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getTalents, postTalent, getTalentById, updateTalent, deleteTalent };