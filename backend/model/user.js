const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name:{ type: String, required: [true, "Please enter your name!"],},
  email:{ type: String, required: [true, "Please enter your email!"],},
  password:{ type: String, required: [true, "Please enter your password"], minLength: [4, "Password should be greater than 4 characters"], select: false,}, // password will NOT be returned in queries by default (hidden for security, must be explicitly selected when needed like login)
  phoneNumber:{ type: Number,},
  addresses:[
    {
      country: { type: String, },
      city:{ type: String, },
      address1:{ type: String, },
      address2:{ type: String, },
      zipCode:{ type: Number,},
      addressType:{ type: String, },
    }
  ],
  role:{ type: String, default: "user", },
  avatar:{
    public_id: { type: String, required: true, },
    url: { type: String, required: true, },
 },
 createdAt:{ type: Date, default: Date.now(), },
 resetPasswordToken: String,
 resetPasswordTime: Date,
});


//  Hash password (PRE SAVE HOOK)
userSchema.pre("save", async function (next){
  if(!this.isModified("password")){ //If password is NOT changed, skip hashing
    next(); 
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
    //this._id = user._id
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

/*
Mongoose pre("save") and methods - Notes

1) pre("save") HOOK:
- This runs automatically BEFORE saving a document in MongoDB
- Used to apply logic like password hashing before data is stored

this inside pre("save"):
- refers to the CURRENT document being saved (current user object)

Example flow:
user.save()
→ pre("save") runs
→ this = that user
→ password is hashed before saving into DB

Important check:
this.isModified("password")
- returns true if password is new or changed
- prevents re-hashing already hashed password on updates

So:
- if password not changed → skip hashing
- if password changed → hash it

2) schema.methods (INSTANCE METHODS):
- Used to add custom functions to model documents
- These functions can be called on any user instance

Example:
user.getJwtToken()
user.comparePassword()

this inside methods:
- refers to the CURRENT user document (the instance calling the method)

3) getJwtToken():
- creates JWT token using user id (this._id)
- used for authentication/login sessions

4) comparePassword():
- compares entered password with hashed password in DB
- returns true or false using bcrypt.compare()

SUMMARY:
- pre("save") = runs automatically before saving data
- methods = custom functions you can call on user objects
- this = current user document in both cases
*/