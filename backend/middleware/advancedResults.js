import Service from "../models/Service.js";
import geocoder from "../utils/geocoder.js";
import getPagination from "../utils/getPagination.js";

const advancedResults = (model, populate) => async(req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = {...req.query };

    // check for geo search
    let geoSearchObject = undefined;
    if (parseInt(reqQuery.geoSearch)) {
        const loc = await geocoder.geocode(reqQuery.geoSearchAddress);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        const radius = parseInt(reqQuery.geoSearchKm) / 6378;
        geoSearchObject = {
            $elemMatch: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, lat], radius
                    ],
                },
            },
        };
    }

    // check for full-text search
    let textSearch = parseInt(reqQuery.textSearch);
    let textSearchDescription = undefined;
    if (textSearch) {
        textSearchDescription = reqQuery.textSearchDescription;
    }

    // fields to exclude
    const removeFields = [
        "select",
        "sort",
        "page",
        "limit",
        "geoSearch",
        "geoSearchAddress",
        "geoSearchKm",
        "textSearch",
        "textSearchDescription",
    ];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // create query string
    let queryString = JSON.stringify(reqQuery);

    // create operators ($gt, $gte, etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in|eq|ne)\b/g, (match) => `$${match}`);

    queryString = processNestedFields(queryString);

    // finding resource
    if (model.collection.collectionName === "services") {
        if (textSearch) {
            const serviceIds = await Service.aggregate([
                { $match: { $text: { $search: textSearchDescription } } },
                { $project: { _id: 1 } },
                { $sort: { score: { $meta: "textScore" } } },
            ]);
            const queryObject = {...JSON.parse(queryString), locations: geoSearchObject, _id: { $in: serviceIds } };
            Object.keys(queryObject).forEach((key) => (queryObject[key] === undefined ? delete queryObject[key] : {}));

            query = model.find(queryObject);
        } else {
            const queryObject = {...JSON.parse(queryString), locations: geoSearchObject };
            Object.keys(queryObject).forEach((key) => (queryObject[key] === undefined ? delete queryObject[key] : {}));

            query = model.find(queryObject);
        }
    } else {
        query = model.find(JSON.parse(queryString));
    }

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
    const { pagination, results } = await getPagination(req, query, populate);

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
      const removeLastComma = str.charAt(str.length - 1) === ",";
      processNestedField("{" + (removeLastComma ? str.replace(/,([^,]*)$/, "$1") : str) + "}");
    });
  }

  let processedNestedFieldsString = "";
  if (processedNestedFields && processedNestedFields.length) {
    processedNestedFieldsString = processedNestedFields[0];
  }
  processedNestedFields.slice(1).forEach((str) => (processedNestedFieldsString += "," + str));

  queryString = queryString.replace(regex, "");
  queryString = queryString.replace(/\s+/, "");

  queryString =
    queryString.substring(0, queryString.length - 1) +
    processedNestedFieldsString +
    queryString.charAt(queryString.length - 1);

  return queryString;
};

export default advancedResults;