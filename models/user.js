const mongoose = require('mongoose');

//User schema 
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: false
    },
    adminNumber:{
        type: String,
        required: false
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    adminReq:{
        type: String,
        required: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    }

});

const User = module.exports = mongoose.model('User', UserSchema);