/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
    return { message: 'Bienvenue sur l\'API Movies App' }
})

// Auth routes
Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
}).prefix('/api/v1/auth')


// .middleware('auth') : Assure que seules les requêtes authentifiées accèdent à ces routes.
// Cart routes
Route.group(() => {
    Route.post('/cart/add', 'CartsController.addToCart').middleware('auth')
    Route.delete('/cart/remove', 'CartsController.removeFromCart').middleware('auth')
    Route.get('/cart', 'CartsController.getCart').middleware('auth')
    Route.put('/cart/:productId', 'CartsController.updateCartItem').middleware('auth')
    Route.delete('/cart/:productId', 'CartsController.deleteCartItem').middleware('auth')
})
.prefix('/api/v1/users')


// Favorites routes
Route.group(() => {
    Route.post('/favorites', "MoviesController.addFavorite").middleware('auth')
    Route.get('/favorites', "MoviesController.getFavorites").middleware('auth')
    Route.delete('/favorites', "MoviesController.clearFavorites").middleware('auth')
    Route.delete('/favorites/:movieId', 'MoviesController.removeFavorite').middleware('auth')
    // Route.delete('/favorites', "MoviesController.removeFavorite").middleware('auth')
    // Route.delete('/favorites/:movieId', 'MoviesController.deleteMovieItem').middleware('auth')

    Route.post('/watched', "MoviesController.addWatched").middleware('auth')
    Route.get('/watched', "MoviesController.getWatched").middleware('auth')

}).prefix('/api/v1/movies')


//User routes
Route.group(() => {
    Route.get('/profile', 'UsersController.getProfile').middleware('auth')
    Route.put('/profile', 'UsersController.updateProfile').middleware('auth')
    Route.put('/password', 'UsersController.updatePassword').middleware('auth')
}).prefix('/api/v1/user')


// Route.get('/', async () => {
//   return 'protected'
// }).middleware('auth')


// http://127.0.0.1:3333/api/v1/movies/favorites