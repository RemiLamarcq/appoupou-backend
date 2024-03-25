const mongoose = require('mongoose');


const priseSchema = mongoose.Schema({
    isBib : Boolean, 
    isDoliprane : Boolean,
    eventHour: String, 
    doliprane: Date, 
    bibQty: Number, 
    isPee: Boolean, 
    isPoo: Boolean, 
    comment: String, 

})

const BiberonsSchema = mongoose.Schema({
    babyName: String,
    date: String,
    prise: [priseSchema]

});

const Biberons = mongoose.model('biberons', BiberonsSchema);

module.exports = Biberons;
