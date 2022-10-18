const responseHandler = (res, status, message, data, pagination) =>
  res.status(status).json({
    status,
    message,
    data,
    pagination,
  });

module.exports = responseHandler;
