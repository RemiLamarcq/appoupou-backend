var express = require('express');
var router = express.Router();
const moment = require('moment');

const Biberons = require('../models/biberons');


router.post('/addBib/:date', async (req, res) => {

    // MockData qui simule l'objet req.body.prise
    const prise = {
        isBib : true,
        isDoliprane : false,
        eventHour : "10h00",
        bibQty : 240, 
        isPee : false, 
        isPoo : true,
        //doliprane : new Date
    }

    try {
        // Recherchez le document Biberons correspondant à la date
        let biberons = await Biberons.findOne({ date : req.params.date });

        // Si le document n'existe pas, créez-le
        if (!biberons) {
            biberons = new Biberons({ date : req.params.date, prise: [] });
        }

        // Ajouter une nouvelle entrée au tableau prise
        biberons.prise.push(
            req.body.prise
        );

        // Enregistrer les modifications dans la base de données
        await biberons.save();

        res.json({ result: true, message: 'Données ajoutées avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de l\'ajout des données', error: error.message });
    }
});

router.get('/allBib/:date', (req, res) => {
    Biberons.find({ date: req.params.date }).then(data => {
        // Trier les données par la clé eventHour
        data.forEach(item => {
            item.prise.sort((a, b) => {
                // Convertir les heures en objets Date pour faciliter la comparaison
                const [hourA, minuteA] = a.eventHour.split(':').map(Number);
                const [hourB, minuteB] = b.eventHour.split(':').map(Number);
                // Comparer les heures
                if (hourA === hourB) {
                    return minuteA - minuteB;
                }
                return hourA - hourB;
            });
        });
        res.json({ result: true, data });
    });
});



// router.get('/allBib/:date', (req, res) => {
//     Biberons.find({ date: req.params.date }).then(data => {
//         res.json({ result: true, data });
//     });
// })


module.exports = router;