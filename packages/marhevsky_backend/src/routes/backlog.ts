import express from 'express';
import backlogController from "../controllers/backlogController";

const router = express.Router();

router.get('/get/all', backlogController.getBacklogs);
router.get('/get/:id', backlogController.getBacklogById);
router.post('/post', backlogController.postBacklog);
router.patch('/update/:id', backlogController.updateBacklog);
router.delete('/delete/:id', backlogController.deleteBacklog);

export = router;