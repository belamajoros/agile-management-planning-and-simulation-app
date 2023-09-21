import express from 'express';
import taskController from "../controllers/taskController";

const router = express.Router();

router.get('/get/all', taskController.getTasks);
router.get('/get/:id', taskController.getTaskById);
router.post('/post', taskController.postTask);
router.patch('/update/:id', taskController.updateTask);
router.delete('/delete/:id', taskController.deleteTask);

export = router;