const getPagination = async(req, query, populate, itemsPerPage = process.env.DEFAULT_PAGE_LIMIT) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || parseInt(itemsPerPage, 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = (await query).length;

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
    pagination.page = page;
    pagination.pages = Math.ceil(total / limit);

    return { pagination, results };
};

export default getPagination;