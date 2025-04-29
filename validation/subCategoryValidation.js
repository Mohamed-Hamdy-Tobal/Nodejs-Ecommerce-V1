import { check } from 'express-validator';
import { validatorMiddleware } from '../middleware/validatorMiddleware.js';
import CategoryModel from '../models/category.model.js';

export const getSubCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid sub-category ID format'),
  validatorMiddleware,
];

export const createSubCategoryValidation = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name'),

  check('slug').optional().isString().withMessage('Slug must be a string'),

  check('category')
    .notEmpty()
    .withMessage('Parent Category ID is required')
    .isMongoId()
    .withMessage('Invalid Parent category ID format')
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error('Parent category not found');
      }
      return true;
    }),

  check('image').optional().isString().withMessage('Image must be a string'),

  validatorMiddleware,
];

export const updateSubCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid category ID format'),

  check('name')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name'),

  check('slug').optional().isString().withMessage('Slug must be a string'),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Parent category ID format')
    .custom(async (categoryId) => {
      if (categoryId) {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
          throw new Error('Parent category not found');
        }
      }
      return true;
    }),

  check('image').optional().isString().withMessage('Image must be a string'),

  validatorMiddleware,
];

export const deleteSubCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid sub-category ID format'),
  validatorMiddleware,
];
