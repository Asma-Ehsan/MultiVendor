class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;


/*
ErrorHandler is a custom error class that inherits features from JavaScript's built-in Error class.

constructor(message, statusCode):
- constructor runs automatically when new object is created
- message and statusCode are parameters passed during object creation

super(message):
- calls parent Error class constructor
- automatically stores error message in this.message
- that's why we don't write this.message = message manually

this.statusCode = statusCode:
- this = current object being created
- left side (this.statusCode) creates/stores property inside object
- right side (statusCode) is incoming parameter value
- Error class does not have the property of statusCode. It is customized by us that's why is is not declared as message

Error.captureStackTrace(this, this.constructor):
- creates clean stack trace for debugging
- this = current error object
- this.constructor = current class (ErrorHandler)
- removes constructor call from stack trace for cleaner errors
*/