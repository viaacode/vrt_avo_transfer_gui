module.exports = {
  success: function (data) {
    return {status: 'success', data: data};
  },
  error: function (statusCode, error) {
    var message = '';

    switch (statusCode) {
      case 404:
        message = '404 Not Found';
        break;

      default:
        return error;
    }

    return {
      status: statusCode,
      jsend: {
        status: 'error',
        message: message
      }
    };
  }
};