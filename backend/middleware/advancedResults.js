const advancedResults = (model, populate) => async(req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = {...req.query };

    // fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // create query string
    let queryString = JSON.stringify(reqQuery);

    // create operators ($gt, $gte, etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in|eq|ne)\b/g, (match) => `$${match}`);

    queryString = processNestedFields(queryString);

    // finding resource
    query = model.find(JSON.parse(queryString));

    // select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || parseInt(process.env.DEFAULT_PAGE_LIMIT, 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // executing query
    const results = await query;

    // pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };

    next();
};

const processNestedFields = (queryString) => {
        const processNestedField = (str) => {
                let getPairs = (obj, keys = []) =>
                    Object.entries(obj).reduce((pairs, [key, value]) => {
                        if (typeof value === "object" && !value.hasOwnProperty("$eq")) pairs.push(...getPairs(value, [...keys, key]));
                        else pairs.push([
                            [...keys, key], value
                        ]);
                        return pairs;
                    }, []);

                let pairs = getPairs(JSON.parse(str)).map(
                        ([
                            [key0, ...keysRest], value
                        ]) => `"${key0}${keysRest.map((x) => `.${x}`).join("")}":${JSON.stringify(value)}`
    );

    processedNestedFields = [...processedNestedFields, ...pairs];
  };

  queryString = queryString.replace("{", "{ ");
  queryString = queryString.replace(/.$/, " }");

  const regex = /((\"\w+\":{)+.*}+,)|((\"\w+\":{)+.*[^ ]}+)/gm;
  const unprocessedNestedFields = queryString.match(regex);
  let processedNestedFields = [];

  if (unprocessedNestedFields && unprocessedNestedFields.length > 0) {
    unprocessedNestedFields.forEach((str) => {
      processNestedField("{" + str.replace(/,([^,]*)$/, "$1") + "}");
    });
  }

  let processedNestedFieldsString = "";
  processedNestedFields.forEach((str) => (processedNestedFieldsString += "," + str));

  queryString = queryString.replace(regex, "");
  queryString = queryString.replace(/\s+/, "");

  if (queryString === "{}") {
    processedNestedFieldsString = processedNestedFieldsString.replace(",", "");
  }

  queryString =
    queryString.substring(0, queryString.length - 1) +
    processedNestedFieldsString +
    queryString.charAt(queryString.length - 1);

  return queryString;
};

export default advancedResults;