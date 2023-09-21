import express from 'express';
import projectController from "../controllers/projectController";

const router = express.Router();

router.get('/get/all', projectController.getProjects);
router.get('/get/:id', projectController.getProjectById);
router.get('/get/creator/:creatorId', projectController.getProjectsByCreator);
router.post('/post', projectController.postProject);
router.patch('/update/:id', projectController.updateProject);
router.delete('/delete/:id', projectController.deleteProject);

export = router;