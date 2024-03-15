const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const User = require('../models/user.js'); // If needed for referencing user data

// Index Route - Show all recipes of a user
router.get('/', async (req, res) => {
	try {
		const userRecipes = await Recipe.find({ owner: req.session.user._id });
		res.render('recipes/index.ejs', {
			recipes: userRecipes,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// New Route - Form to create a new recipe
router.get('/new', (req, res) => {
	res.render('recipes/new.ejs');
});

// Create Route - Post request to create a new recipe
router.post('/', async (req, res) => {
	try {
		req.body.owner = req.session.user._id; // Setting the owner of the recipe
		await Recipe.create(req.body);
		res.redirect(`/recipes`);
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Show Route - Show a single recipe details
router.get('/:recipeId', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId).populate(
			'ingredients'
		);
		// Get all ingredients to Users can choose to relate them in the view
		const allIngredients = await Ingredient.find({});
		res.render('recipes/show.ejs', {
			recipe: recipe,
			allIngredients: allIngredients,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Edit Route - Form to edit an existing recipe
router.get('/:recipeId/edit', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId);
		const allIngredients = await Ingredient.find({});
		res.render('recipes/edit.ejs', {
			recipe: recipe,
			allIngredients: allIngredients,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Update Route - Put request to update a recipe
router.put('/:recipeId', async (req, res) => {
	try {
		// Find the existing recipe
		const recipeToUpdate = await Recipe.findById(req.params.recipeId);
		// Update basic fields
		recipeToUpdate.name = req.body.name;
		recipeToUpdate.instructions = req.body.instructions;
		// Handling ingredients from checkboxes
		// Ensure req.body.ingredients is an array. If only one ingredient is selected, it might be a string.
		const selectedIngredients = Array.isArray(req.body.ingredients)
			? req.body.ingredients
			: [req.body.ingredients];
		// Update ingredients
		recipeToUpdate.ingredients = selectedIngredients;
		await recipeToUpdate.save();
		res.redirect(`/recipes/${req.params.recipeId}`);
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Delete Route - Delete a specific recipe
router.delete('/:recipeId', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId);
		await recipe.deleteOne();
		res.redirect(`/recipes`);
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// Relating Data Routes

// GET - to render an Add Ingredients view
router.get('/:recipeId/add-ingredients', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId).populate(
			'ingredients'
		);
		const allIngredients = await Ingredient.find({});

		res.render('recipes/add-ingredients.ejs', {
			recipe: recipe,
			allIngredients: allIngredients,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// POST - to add ingredients to a recipe
router.post('/:recipeId/ingredients', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId);

		// Ensure req.body.ingredients is an array
		const ingredientIds = Array.isArray(req.body.ingredients)
			? req.body.ingredients
			: [req.body.ingredients];

		// Add selected ingredients to the recipe
		// Level up - This ensures no duplicates
		recipe.ingredients = [
			...new Set([...recipe.ingredients, ...ingredientIds]),
		];
		await recipe.save();

		res.redirect(`/recipes/${req.params.recipeId}`);
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

module.exports = router;
