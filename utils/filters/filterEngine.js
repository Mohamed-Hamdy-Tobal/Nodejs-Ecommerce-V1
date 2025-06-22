export class FilterEngine {
  constructor(config = {}) {
    this.config = {
      defaultSort: "-createdAt",
      defaultSelect: "-__v",
      caseSensitive: false,
      ...config,
    };
  }

  /**
   * Main filter processing method
   * @param {Object} query - Query parameters from request
   * @param {Object} filterConfig - Configuration for this specific filter
   * @returns {Object} - { filter, sort, select }
   */
  processFilters(query, filterConfig = {}) {
    const filter = {};
    let sort = filterConfig.defaultSort || this.config.defaultSort;
    let select = filterConfig.defaultSelect || this.config.defaultSelect;

    // Process each filter type
    this._processExactMatches(query, filter, filterConfig.exactMatch || []);
    this._processRangeFilters(query, filter, filterConfig.ranges || []);
    this._processArrayFilters(query, filter, filterConfig.arrays || []);
    this._processBooleanFilters(query, filter, filterConfig.booleans || []);
    this._processSearchFilters(query, filter, filterConfig.search || []);
    this._processDateFilters(query, filter, filterConfig.dates || []);
    this._processCustomFilters(query, filter, filterConfig.custom || []);

    // Process sorting
    if (query.sort) {
      sort = this._processSorting(query.sort);
    }

    // Process field selection
    if (query.fields) {
      select = this._processFieldSelection(query.fields);
    }

    return { filter, sort, select };
  }

  // ===== EXACT MATCH FILTERS =====
  _processExactMatches(query, filter, exactMatchFields) {
    exactMatchFields.forEach((field) => {
      if (query[field]) {
        const values = this._parseCommaSeparated(query[field]);
        filter[field] = values.length === 1 ? values[0] : { $in: values };
      }
    });
  }

  // ===== RANGE FILTERS =====
  _processRangeFilters(query, filter, rangeFields) {
    rangeFields.forEach((field) => {
      const exact = query[`exact_${field}`];
      const gte = query[`${field}_gte`];
      const lte = query[`${field}_lte`];
      const gt = query[`${field}_gt`];
      const lt = query[`${field}_lt`];

      if (exact) {
        filter[field] = this._convertValue(exact);
      } else {
        const range = {};
        if (gte) range.$gte = this._convertValue(gte);
        if (lte) range.$lte = this._convertValue(lte);
        if (gt) range.$gt = this._convertValue(gt);
        if (lt) range.$lt = this._convertValue(lt);

        if (Object.keys(range).length > 0) {
          filter[field] = range;
        }
      }
    });
  }

  // ===== ARRAY FILTERS =====
  _processArrayFilters(query, filter, arrayFields) {
    arrayFields.forEach((field) => {
      if (query[field]) {
        const values = this._parseCommaSeparated(query[field]);
        filter[field] = { $in: values };
      }
    });
  }

  // ===== BOOLEAN FILTERS =====
  _processBooleanFilters(query, filter, booleanFields) {
    booleanFields.forEach((field) => {
      if (query[field] !== undefined) {
        filter[field] = query[field] === "true";
      }
    });
  }

  // ===== SEARCH FILTERS =====
  _processSearchFilters(query, filter, searchFields) {
    if (query.search && searchFields.length > 0) {
      const keyword = query.search.trim();
      const options = this.config.caseSensitive ? "" : "i";

      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: keyword, $options: options },
      }));
    }
  }

  // ===== DATE FILTERS =====
  _processDateFilters(query, filter, dateFields) {
    dateFields.forEach((field) => {
      const exact = query[`exact_${field}`];
      const after = query[`${field}_after`];
      const before = query[`${field}_before`];

      if (exact) {
        filter[field] = new Date(exact);
      } else {
        const range = {};
        if (after) range.$gte = new Date(after);
        if (before) range.$lte = new Date(before);

        if (Object.keys(range).length > 0) {
          filter[field] = range;
        }
      }
    });
  }

  // ===== CUSTOM FILTERS =====
  _processCustomFilters(query, filter, customFilters) {
    customFilters.forEach(({ field, handler }) => {
      if (query[field] !== undefined) {
        const result = handler(query[field], query);
        if (result) {
          Object.assign(filter, result);
        }
      }
    });
  }

  // ===== UTILITY METHODS =====
  _parseCommaSeparated(value) {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
  }

  _convertValue(value) {
    // Try to convert to number if it's numeric
    if (!Number.isNaN(value) && !Number.isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    return value;
  }

  _processSorting(sortString) {
    return sortString
      .split(",")
      .map((field) => {
        const trimmed = field.trim();
        return trimmed.startsWith("-") ? `-${trimmed.slice(1)}` : trimmed;
      })
      .join(" ");
  }

  _processFieldSelection(fieldsString) {
    return fieldsString
      .split(",")
      .map((field) => {
        const trimmed = field.trim();
        return trimmed.startsWith("-") ? `-${trimmed.slice(1)}` : trimmed;
      })
      .join(" ");
  }
}
