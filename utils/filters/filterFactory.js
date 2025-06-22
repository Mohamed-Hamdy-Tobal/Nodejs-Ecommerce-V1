import { FilterEngine } from "./filterEngine.js";
import { filterConfigs } from "./filterConfigs.js";

export class FilterFactory {
  static engine = new FilterEngine();

  /**
   * Create a filter function for a specific entity
   * @param {string} entityType - Type of entity (products, users, etc.)
   * @param {Object} customConfig - Custom configuration to override defaults
   * @returns {Function} - Filter function
   */
  static createFilter(entityType, customConfig = {}) {
    const config = {
      ...filterConfigs[entityType],
      ...customConfig,
    };

    return (query) => {
      return this.engine.processFilters(query, config);
    };
  }

  /**
   * Get a pre-configured filter function
   * @param {string} entityType - Type of entity
   * @returns {Function} - Filter function
   */
  static getFilter(entityType) {
    if (!filterConfigs[entityType]) {
      throw new Error(`Filter configuration not found for entity type: ${entityType}`);
    }
    return this.createFilter(entityType);
  }

  /**
   * Register a new filter configuration
   * @param {string} entityType - Type of entity
   * @param {Object} config - Filter configuration
   */
  static registerFilter(entityType, config) {
    filterConfigs[entityType] = config;
  }
}

// Register a new filter configuration
// FilterFactory.registerFilter('blogs', {
//   exactMatch: ['author', 'category'],
//   arrays: ['tags', 'topics'],
//   ranges: ['views', 'likes', 'readTime'],
//   booleans: ['isPublished', 'isFeatured'],
//   search: ['title', 'content', 'excerpt'],
//   dates: ['createdAt', 'publishedAt', 'updatedAt'],
//   custom: [
//     {
//       field: 'author_name',
//       handler: (value) => ({
//         'author.name': { $regex: value, $options: 'i' }
//       })
//     }
//   ],
//   defaultSort: '-publishedAt',
//   defaultSelect: '-__v -draft'
// });

// const customProductFilter = FilterFactory.createFilter('products', {
//   // Override default configuration
//   defaultSort: 'price',
//   search: ['title'], // Only search in title
//   custom: [
//     {
//       field: 'price_range',
//       handler: (value) => {
//         const [min, max] = value.split('-').map(Number);
//         return {
//           price: { $gte: min, $lte: max }
//         };
//       }
//     }
//   ]
// });
