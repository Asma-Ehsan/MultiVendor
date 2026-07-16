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

What is Error.captureStackTrace()?
- It is a built-in Node.js method.
- Its purpose is to Create a clean stack trace for a custom error object by removing unnecessary constructor calls.
- Syntax: Error.captureStackTrace(targetObject, constructorFunction);
It takes two parameters.

------------------------------------------------
Error.captureStackTrace(this, this.constructor):
------------------------------------------------

Parameter 1: this

Error.captureStackTrace(this, ...);

- "this" refers to the current ErrorHandler object.
- Node.js attaches the generated stack trace to this error object.

-------------------------------------------

Parameter 2: this.constructor

Error.captureStackTrace(this, this.constructor);

- "this.constructor" refers to the ErrorHandler constructor function.
- It is equivalent to:

Error.captureStackTrace(this, ErrorHandler);

Node.js gives the second parameter a special meaning.

It tells Node.js:

"While generating the stack trace, remove the constructor function and all stack frames above it."

-------------------------------------------

Without captureStackTrace()

Call Stack:

loginUser()
    ↓
new ErrorHandler()
    ↓
Error.captureStackTrace()

Stack Trace:

Error: Invalid Credentials
at ErrorHandler (...)
at loginUser (...)
at app.js (...)

Notice:
- The constructor (ErrorHandler) appears in the stack trace, which is usually unnecessary.

-------------------------------------------

With captureStackTrace(this, this.constructor)

Node.js finds the ErrorHandler constructor in the call stack and removes:

- Error.captureStackTrace()
- ErrorHandler()

The resulting stack trace becomes:

Error: Invalid Credentials
at loginUser (...)
at app.js (...)

Now the stack trace starts from the place where the error was actually created, making debugging easier.

-------------------------------------------
*/