// WRAPPER FUNCTION
// it receives a(n) (async) function with (req, res, next) params which will return a function
// which will apply fct to the params and will also perform catch
const asyncHandler = (fct) => (req, res, next) => Promise.resolve(fct(req, res, next)).catch(next);

export default asyncHandler;