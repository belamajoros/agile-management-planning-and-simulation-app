import express from 'express';
import talentController from "../controllers/talentController";

const router = express.Router();

/**
 * @apiVersion 1.0.0
 */

/**
 * @apiDefine RecordNotFoundError
 *
 * @apiError (404) RecordNotFound Record with this id was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "RecordNotFound"
 *     }
 */

/**
 * @api {get} /talent/get/all Get all
 * @apiName getTalents
 * @apiGroup Talent
 *
 * @apiSuccess (200) {Array} talents Array of all talents.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "talents": [
 *         {
 *             "_id": "6238e9e63d65366afdde8ed2",
 *             "name": "Writing documentation experience",
 *             "category": {
 *                 "_id": "6238e8c53d65366afdde8ec5",
 *                 "name": "Documentation",
 *                 "description": "Writing project documentation.",
 *                 "createdAt": "2022-03-21T21:06:13.727Z",
 *                 "updatedAt": "2022-03-21T21:06:13.727Z",
 *                 "__v": 0
 *             },
 *             "buff_value": 10,
 *             "description": "Writing documentation 10% faster then normal worker.",
 *             "createdAt": "2022-03-21T21:11:02.902Z",
 *             "updatedAt": "2022-03-21T21:11:02.902Z",
 *             "__v": 0
 *         },
 *         {
 *             "_id": "6238ec519605f970292b7677",
 *             "name": "Writing documentation medium experience",
 *             "category": {
 *                 "_id": "6238e8c53d65366afdde8ec5",
 *                 "name": "Documentation",
 *                 "description": "Writing project documentation.",
 *                 "createdAt": "2022-03-21T21:06:13.727Z",
 *                 "updatedAt": "2022-03-21T21:06:13.727Z",
 *                 "__v": 0
 *             },
 *             "buff_value": 20,
 *             "description": "Writing documentation 20% faster then normal worker.",
 *             "createdAt": "2022-03-21T21:21:21.240Z",
 *             "updatedAt": "2022-03-21T21:21:21.240Z",
 *             "__v": 0
 *         }
 *     ]
 * }
 *
 * @apiUse RecordNotFoundError
 */
router.get('/get/all', talentController.getTalents);

/**
 * @api {get} /talent/get/:id Get by ID
 * @apiName getTalentById
 * @apiGroup Talent
 *
 * @apiParam {number} id Talent's unique ID.
 *
 * @apiSuccess (200) {String} name Talent name.
 * @apiSuccess (200) {Object} category Talent category.
 * @apiSuccess (200) {Number} buff_value Talent buff_value.
 * @apiSuccess (200) {String} description Talent description.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "talent": {
 *         "_id": "6238e9e63d65366afdde8ed2",
 *         "name": "Writing documentation experience",
 *         "category": {
 *             "_id": "6238e8c53d65366afdde8ec5",
 *             "name": "Documentation",
 *             "description": "Writing project documentation.",
 *             "createdAt": "2022-03-21T21:06:13.727Z",
 *             "updatedAt": "2022-03-21T21:06:13.727Z",
 *             "__v": 0
 *         },
 *         "buff_value": 10,
 *         "description": "Writing documentation 10% faster then normal worker.",
 *         "createdAt": "2022-03-21T21:11:02.902Z",
 *         "updatedAt": "2022-03-21T21:11:02.902Z",
 *         "__v": 0
 *     }
*      }
 *
 * @apiUse RecordNotFoundError
 */
router.get('/get/:id', talentController.getTalentById);


router.post('/post', talentController.postTalent);
router.patch('/update/:id', talentController.updateTalent);
router.delete('/delete/:id', talentController.deleteTalent);

export = router;