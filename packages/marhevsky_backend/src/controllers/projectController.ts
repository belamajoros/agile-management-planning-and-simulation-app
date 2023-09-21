import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import logging from "../config/logging";
import Project from "../models/project";

const NAMESPACE = 'Project';

const getProjects = (req: Request, res: Response, next: NextFunction) => {
    Project.find()
        .exec()
        .then((projects) => {
            if (projects) {
                return res.status(200).json(projects);
            } else {
                return res.status(404).json({message: "No record of Project does exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getProjects");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postProject = (req: Request, res: Response, next: NextFunction) => {
    let {name, description, template, tasks, team, backlogs, creator, collaborators} = req.body;
    const _project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        template,
        tasks,
        team,
        backlogs,
        creator,
        collaborators
    });

    logging.info(NAMESPACE, name);

    return _project
        .save()
        .then((project) => {
            return res.status(201).json(project);
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch postProject");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getProjectById = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    Project.findOne({_id: id})
        .exec()
        .then((project) => {
            if (project) {
                return res.status(200).json(project);
            } else {
                return res.status(404).json({message: "Project with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getProjectById");
            return res.status(500).json({
                message: error.message,
                error
            });
        });

};

const getProjectsByCreator = (req: Request, res: Response, next: NextFunction) => {
    const {creatorId} = req.params;
    const id = new mongoose.Types.ObjectId(creatorId)
    Project.find({creator: id})
        .exec()
        .then((projects) => {
            if (projects.length > 0) {
                console.log(projects)
                return res.status(200).json(projects);
            } else {
                return res.status(404).json({message: "No projects found for creator with id: " + creatorId});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch getProjectsByCreator");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const updateProject = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const postData = req.body;

    Project.findOneAndUpdate({_id: id},
        postData, { new : true })
        .exec()
        .then((updated) => {
            if (updated) {
                return res.status(200).json(updated);
            } else {
                return res.status(404).json({message: "Project with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch updateProject");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

const deleteProject = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    Project.findOneAndDelete({_id: id})
        .exec()
        .then((record) => {
            if (record) {
                return res.status(200).json({message: "Project deleted successfully!"});
            } else {
                return res.status(404).json({message: "Project with id:" + id +" does not exist."});
            }
        })
        .catch((error) => {
            logging.info(NAMESPACE, "Error in catch deleteProject");
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default {getProjects, postProject, getProjectById, getProjectsByCreator, updateProject, deleteProject};