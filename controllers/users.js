const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// Index
router.get('/', async (req, res) => {
	try {
		const allUsers = await User.find();
		res.render('users/index.ejs', { allUsers });
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Show
router.get('/:userId', async (req, res) => {
	try {
		const pageOwner = await User.findById(req.params.userId);
		const ownerRecipes = await Recipe.find({ owner: pageOwner }).populate(
			'ingredients'
		);
		res.render('users/show.ejs', {
			ownerRecipes,
			pageOwner,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

module.exports = router;
