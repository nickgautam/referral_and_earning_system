const { validationResult } = require('express-validator')


global.throw_error = (req) => {
    const error = validationResult(req)
    const response = {}
    if(error.array().length){
        response['status'] = 400
        response['message'] = error.array()[0].msg
        return response
    }
}