const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient.js');

// Index Route - List all ingredients
router.get('/', async (req, res) => {
	try {
		const ingredients = await Ingredient.find({});
		res.render('ingredients/index.ejs', {
			ingredients: ingredients,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Create Route - Add a new ingredient to all ingredients
router.post('/', async (req, res) => {
	try {
		await Ingredient.create(req.body);
		res.redirect('/ingredients');
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

module.exports = router;
