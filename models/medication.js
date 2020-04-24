const mongoose = require('mongoose');

//Medication schema 
const MedicationSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required:false
    },
    createdUser: { 
        type: mongoose.Schema.ObjectId, ref: 'User' 
    },
    adminCode: {
        type: String, ref: 'adminReq'
    }
});

const Medication = module.exports = mongoose.model('Medication', MedicationSchema);