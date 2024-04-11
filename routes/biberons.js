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

router.put('/updatePrise/:biberonsId/:priseId', async (req, res) => {
    try {
        const biberonsId = req.params.biberonsId;
        const priseId = req.params.priseId;
        // const updatedPriseData = {
        //     isSleep : true,
        //     eventHour: '15:20', 
        //     sleepEnd : '17:00',
        //     isPee: true, 


        // }
        const updatedPriseData = req.body.prise; // Les données mises à jour de la prise

        // Utilisez findOneAndUpdate pour mettre à jour la prise spécifique dans le document Biberons
        const updatedBiberons = await Biberons.findOneAndUpdate(
            { _id: biberonsId, 'prise._id': priseId }, // Condition pour trouver le document Biberons contenant la prise spécifique
            { $set: { 'prise.$': updatedPriseData } }, // Mettez à jour la prise spécifique avec les nouvelles données
            { new: true } // Pour renvoyer le document Biberons mis à jour
        );

        if (updatedBiberons) {
            res.json({ success: true, message: 'Prise mise à jour avec succès', updatedBiberons });
        } else {
            res.status(404).json({ success: false, message: 'Prise non trouvée ou mise à jour impossible' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la prise :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la prise', error });
    }
});

router.put('/deletePrise/:biberonsId/:priseId', async (req, res) => {
    try {
        const biberonsId = req.params.biberonsId;
        const priseId = req.params.priseId;

        // Utilisez findOneAndUpdate pour supprimer la prise spécifique du tableau d'objet prise
        const updatedBiberons = await Biberons.findOneAndUpdate(
            { _id: biberonsId }, // Recherchez le document Biberons par son ID
            { $pull: { prise: { _id: priseId } } }, // Supprimez l'élément spécifique du tableau prise
            { new: true } // Pour renvoyer le document Biberons mis à jour
        );

        if (updatedBiberons) {
            res.json({ success: true, message: 'Prise supprimée avec succès', updatedBiberons });
        } else {
            res.status(404).json({ success: false, message: 'Prise non trouvée ou suppression impossible' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la prise :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la prise', error });
    }

});


module.exports = router;