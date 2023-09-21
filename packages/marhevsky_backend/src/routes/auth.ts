import express from "express";
import controller from "../controllers/authController";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken);
router.post('/register', controller.register);
router.post('/createUserWithId', controller.createUserWithId);
router.post('/login', controller.login);

export = router;
