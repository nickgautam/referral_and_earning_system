const { validationResult } = require('express-validator')
// const io = require('../index')
// const io = require('socket.io')(server);

global.throw_error = (req) => {
    const error = validationResult(req)
    const response = {}
    if (error.array().length) {
        // io.emit('validationError', error.array().map(e => e.msg))
        response['status'] = 400
        response['message'] = error.array()[0].msg
        return response
    }
    return null
}