/**
 * Utility function for paginating database results
 * @param {Model} model - Mongoose model to query
 * @param {Object} req - Express request object
 * @param {Object} options - Additional query options
 * @returns {Object} Results and pagination metadata
 */

// Pagination utility function
const paginateResults = async (model, req, options = {}) => {
  // Default pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query based on provided options
  let query = model.find(options.filter || {});

  // Apply sorting if provided
  if (options.sort) {
    query = query.sort(options.sort);
  }

  // Handle population of referenced documents if needed ===>  لجلب بيانات مرتبطة (references)
  if (options.populate) {
    query = query.populate(options.populate);
  }

  // Apply selection if provided ===>>  لجلب بيانات محددة
  if (options.select) {
    query = query.select(options.select);
  }

  // Execute the query with pagination
  const results = await query.skip(skip).limit(limit);

  // Get total count for pagination metadata
  const totalCount = await model.countDocuments(options.filter || {});

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    results,
    pagination: {
      currentPage: page,
      limit,
      totalCount,
      totalPages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    },
  };
};

export default paginateResults;
