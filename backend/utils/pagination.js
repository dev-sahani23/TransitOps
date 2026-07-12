/**
 * Extracts and calculates pagination parameters from the query object.
 * @param {Object} query - Express request query object
 * @returns {Object} { skip, take, page, limit }
 */
exports.buildPagination = (query) => {
  const page = parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
  const limit = parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 10;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  return { skip, take, page, limit };
};
