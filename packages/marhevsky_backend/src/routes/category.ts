import express from 'express';
import categoryController from "../controllers/categoryController";
import extractJWT from "../middleware/extractJWT";

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
 * @api {get} /category/get/all Get all
 * @apiName getCategories
 * @apiGroup Category
 *
 * @apiSuccess (200) {Array} categories Array of all categories.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "categories": [
 *         {
 *             "_id": "6238e8c53d65366afdde8ec5",
 *             "name": "Documentation",
 *             "description": "Writing project documentation.",
 *             "createdAt": "2022-03-21T21:06:13.727Z",
 *             "updatedAt": "2022-03-21T21:06:13.727Z",
 *             "__v": 0
 *         },
 *         {
 *             "_id": "6238e8e73d65366afdde8ec8",
 *             "name": "Code",
 *             "description": "Writing, editing, ect. anything related to code.",
 *             "createdAt": "2022-03-21T21:06:47.229Z",
 *             "updatedAt": "2022-04-06T11:48:12.512Z",
 *             "__v": 0
 *         },
 *         {
 *             "_id": "6238e8fa3d65366afdde8ecb",
 *             "name": "Testing",
 *             "description": "Testing code or some solution.",
 *             "createdAt": "2022-03-21T21:07:06.665Z",
 *             "updatedAt": "2022-03-21T21:07:06.665Z",
 *             "__v": 0
 *         },
 *         {
 *             "_id": "6238e92d3d65366afdde8ece",
 *             "name": "Design",
 *             "description": "Designing the solution.",
 *             "createdAt": "2022-03-21T21:07:57.625Z",
 *             "updatedAt": "2022-03-21T21:07:57.625Z",
 *             "__v": 0
 *         }
 *     ]
 * }
 *
 * @apiUse RecordNotFoundError
 */

router.get('/get/all', categoryController.getCategories);

/**
 * @api {get} /category/get/:id Get by ID
 * @apiName getCategoryById
 * @apiGroup Category
 *
 * @apiParam {number} id Category's unique ID.
 *
 * @apiSuccess (200) {String} name Category name.
 * @apiSuccess (200) {String} description Category description.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "categories": {
 *          "_id": "6238e8c53d65366afdde8ec5",
 *          "name": "Documentation",
 *          "description": "Writing project documentation.",
 *          "createdAt": "2022-03-21T21:06:13.727Z",
 *          "updatedAt": "2022-03-21T21:06:13.727Z",
 *          "__v": 0
 *      }
*      }
 *
 * @apiUse RecordNotFoundError
 */
router.get('/get/:id', categoryController.getCategoryById);


/**
 * @api {post} /category/post Post
 * @apiName postCategory
 * @apiGroup Category
 *
 * @apiBody {String} name Category name.
 * @apiBody {description} description Description of the Category.
 *
 * @apiSuccess (201) {String} name Category name.
 * @apiSuccess (201) {String} description Category description.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "name": "Code",
 *       "description": "Tasks related to coding."
 *     }
 *
 * @apiError (500) CouldNotPostError Could not post Category
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500
 *     {
 *       "error": "Could not post Category"
 *     }
 */
router.post('/post', categoryController.postCategory);


/**
 * @api {put} /category/update/:id Update
 * @apiName updateCategory
 * @apiGroup Category
 *
 * @apiParam {number} id Unique category ID .
 *
 * @apiBody {String} name Category name.
 * @apiBody {description} description Description of the Category.
 *
 * @apiSuccess (200) {String} name Category name.
 * @apiSuccess (200) {String} description Category description.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "Code",
 *       "description": "Tasks related to coding."
 *     }
 *
 * @apiError (404) CouldNotUpdateError Could not update Category
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404
 *     {
 *       "error": "Could not update Category"
 *     }
 */
router.patch('/update/:id', categoryController.updateCategory);

/**
 * @api {delete} /category/delete/:id Delete
 * @apiName deleteCategory
 * @apiGroup Category
 *
 * @apiParam {number} id Unique category ID .
 *
 * @apiSuccess (204) {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 OK
 *     {
 *       "message": "Category "{id}" deleted successfully.",
 *     }
 *
 * @apiError (404) CouldNotDeleteError Could not delete Category
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404
 *     {
 *       "error": "Could not delete Category"
 *     }
 */
router.delete('/delete/:id', categoryController.deleteCategory);

export = router;