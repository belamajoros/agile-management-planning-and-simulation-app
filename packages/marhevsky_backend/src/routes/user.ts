import express from 'express';
import controller from '../controllers/userController';
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get('/get/all', controller.getAllUsers);
router.get('/get/:id', controller.getUserById);
router.patch('/update/:id', controller.updateUser);
router.delete('/delete/:id', controller.deleteUser);

export = router;