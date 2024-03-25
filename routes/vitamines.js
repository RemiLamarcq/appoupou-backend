var express = require('express');
var router = express.Router();
const moment = require('moment');

const Vitamines = require('../models/vitamines');


router.post('/give', (req, res) => {
    // Récupérer la date actuelle
    const currentDate = moment().format('DD-MM-YYYY');
    // Créer un nouvel objet Vitamines avec seulement la date
    const newDate = new Vitamines({
        babyName : 'Ernest',
        date: currentDate,
        isGiven: true
    });
    newDate.save().then(data =>{
        res.json({result : true, data});
    }).catch(error => {
        res.status(500).json({ result: false, error: error.message });
    });
    
})

router.get('/give/:date',(req,res) => {
    Vitamines.findOne({date : req.params.date}).then(data => {
        res.json({resutl : true, isGiven : data.isGiven})
    })
})


module.exports = router;
