const mongoose = require('mongoose');


const vitaminesSchema = mongoose.Schema({
    babyName : String,
    date: String,
    isGiven: Boolean

});

const Vitamines = mongoose.model('vitamines', vitaminesSchema);

module.exports = Vitamines;
