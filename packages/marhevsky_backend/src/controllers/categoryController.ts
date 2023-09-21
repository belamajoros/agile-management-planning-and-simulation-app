import {NextFunction, Request, Response} from "express";
import logging from "../config/logging";
import Category from "../models/category";
import mongoose from "mongoose";

const NAMESPACE = 'Category';

const getCategories = (req: Request, res: Response, next: NextFunction) => {
    Category.find()
        .exec()
        .then((categories) => {
            if (categories) {
                return res.status(200).json(categories);
            } else {
                return res.status(404).json({message: "No record of Category does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getCategories");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postCategory = (req: Request, res: Response, next: NextFunction) => {
    let { name, description, creator } = req.body;
    const _category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        creator
    });
    logging.info(NAMESPACE, name);

    return _category
        .save()
        .then((category) => {
            return res.status(201).json(category);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postCategory");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};
const getCategoryById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Category.findOne({ _id : id })
        .exec()
        .then((categories) => {
            if (categories) {
                return res.status(200).json(categories);
            } else {
                return res.status(404).json({message: "Category with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getCategoryById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateCategory = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postData = req.body;

    console.log(id);
    Category.findOneAndUpdate({ _id : id }, postData, { new: true } )
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Category with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateCategory");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteCategory = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Category.findOneAndDelete({_id : id})
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Category deleted successfully!"});
            } else {
                return res.status(404).json({message: "Category with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteCategory");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { getCategories, postCategory, updateCategory, getCategoryById, deleteCategory };