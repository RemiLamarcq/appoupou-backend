var express = require('express');
var router = express.Router();
const moment = require('moment');

const Vitamines = require('../models/vitamines');


router.post('/give/:date', (req, res) => {
    // Récupérer la date actuelle
    const currentDate = moment().format('YYYY-MM-DD');
    // Créer un nouvel objet Vitamines avec seulement la date
    const newDate = new Vitamines({
        babyName : 'Ernest',
        date: req.params.date,
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
        if (data){
            res.json({result : true, isGiven : data.isGiven})
        }else{
            res.json({result : true, isGiven : false})
        }
        
    })
})


module.exports = router;
