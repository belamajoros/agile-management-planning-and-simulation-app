import express from 'express';
import workerController from "../controllers/workerController";

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
 * @api {get} /worker/get/all Get all
 * @apiName getWorker
 * @apiGroup Worker
 *
 * @apiSuccess (200) {Array} workers Array of all workers.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "workers": [
 *         {
 *             "_id": "62e01d139b13c4477ca32b45",
 *             "name": "string",
 *             "description": "string",
 *             "talents": [
 *                 {
 *                     "_id": "6238e9e63d65366afdde8ed2",
 *                     "name": "Writing documentation experience",
 *                     "category": {
 *                         "_id": "6238e8c53d65366afdde8ec5",
 *                         "name": "Documentation",
 *                         "description": "Writing project documentation.",
 *                         "createdAt": "2022-03-21T21:06:13.727Z",
 *                         "updatedAt": "2022-03-21T21:06:13.727Z",
 *                         "__v": 0
 *                     },
 *                     "buff_value": 10,
 *                     "description": "Writing documentation 10% faster then normal worker.",
 *                     "createdAt": "2022-03-21T21:11:02.902Z",
 *                     "updatedAt": "2022-03-21T21:11:02.902Z",
 *                     "__v": 0
 *                 },
 *                 {
 *                     "_id": "6238ec519605f970292b7677",
 *                     "name": "Writing documentation medium experience",
 *                     "category": {
 *                         "_id": "6238e8c53d65366afdde8ec5",
 *                         "name": "Documentation",
 *                         "description": "Writing project documentation.",
 *                         "createdAt": "2022-03-21T21:06:13.727Z",
 *                         "updatedAt": "2022-03-21T21:06:13.727Z",
 *                         "__v": 0
 *                     },
 *                     "buff_value": 20,
 *                     "description": "Writing documentation 20% faster then normal worker.",
 *                     "createdAt": "2022-03-21T21:21:21.240Z",
 *                     "updatedAt": "2022-03-21T21:21:21.240Z",
 *                     "__v": 0
 *                 }
 *             ],
 *             "createdAt": "2022-07-26T16:57:55.486Z",
 *             "updatedAt": "2022-07-26T16:57:55.486Z",
 *             "__v": 0
 *         },
 *         {
 *             "_id": "62e01da69b13c4477ca32b4f",
 *             "name": "jurko",
 *             "description": "Jurko ma rad dokumentovanie.",
 *             "talents": [
 *                 {
 *                     "_id": "6238ec519605f970292b7677",
 *                     "name": "Writing documentation medium experience",
 *                     "category": {
 *                         "_id": "6238e8c53d65366afdde8ec5",
 *                         "name": "Documentation",
 *                         "description": "Writing project documentation.",
 *                         "createdAt": "2022-03-21T21:06:13.727Z",
 *                         "updatedAt": "2022-03-21T21:06:13.727Z",
 *                         "__v": 0
 *                     },
 *                     "buff_value": 20,
 *                     "description": "Writing documentation 20% faster then normal worker.",
 *                     "createdAt": "2022-03-21T21:21:21.240Z",
 *                     "updatedAt": "2022-03-21T21:21:21.240Z",
 *                     "__v": 0
 *                 }
 *             ],
 *             "createdAt": "2022-07-26T17:00:22.849Z",
 *             "updatedAt": "2022-07-26T17:00:22.849Z",
 *             "__v": 0
 *         }
 *     ]
 * }
 *
 * @apiUse RecordNotFoundError
 */
router.get('/get/all', workerController.getWorkers);

/**
 * @api {get} /worker/get/:id Get by ID
 * @apiName getWorkerById
 * @apiGroup Worker
 *
 * @apiParam {number} id Worker's unique ID.
 *
 * @apiSuccess (200) {String} name Worker's name.
 * @apiSuccess (200) {String} description Worker's description.
 * @apiSuccess (200) {Array} talents Array of worker's talents.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "worker": {
 *         "_id": "62e01da69b13c4477ca32b4f",
 *         "name": "jurko",
 *         "description": "Jurko ma rad dokumentovanie.",
 *         "talents": [
 *             {
 *                 "_id": "6238ec519605f970292b7677",
 *                 "name": "Writing documentation medium experience",
 *                 "category": {
 *                     "_id": "6238e8c53d65366afdde8ec5",
 *                     "name": "Documentation",
 *                     "description": "Writing project documentation.",
 *                     "createdAt": "2022-03-21T21:06:13.727Z",
 *                     "updatedAt": "2022-03-21T21:06:13.727Z",
 *                     "__v": 0
 *                 },
 *                 "buff_value": 20,
 *                 "description": "Writing documentation 20% faster then normal worker.",
 *                 "createdAt": "2022-03-21T21:21:21.240Z",
 *                 "updatedAt": "2022-03-21T21:21:21.240Z",
 *                 "__v": 0
 *             }
 *         ],
 *         "createdAt": "2022-07-26T17:00:22.849Z",
 *         "updatedAt": "2022-07-26T17:00:22.849Z",
 *         "__v": 0
 *     }
 * }
 *
 * @apiUse RecordNotFoundError
 */
router.get('/get/:id', workerController.getWorkerById);
router.post('/post', workerController.postWorker);
router.patch('/update/:id', workerController.updateWorker);
router.delete('/delete/:id', workerController.deleteWorker);

export = router;