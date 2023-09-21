import express, { Request, Response } from 'express';
import idSignJWT from '../functions/idSignJWT';

const router = express.Router();

router.post('/signJWT', (req: Request, res: Response) => {
    const user_id = req.body.user_id;

    idSignJWT(user_id, (error: Error | null, token: string | null) => {
        if (error) {
            return res.status(500).json({error: error.message});
        }
        if (token) {
            return res.status(200).json({token: token});
        }
    });
});

export default router;