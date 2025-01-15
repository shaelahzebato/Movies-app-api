import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FavoriteMovie from 'App/Models/FavoriteMovie'
import WatchedMovie from 'App/Models/WatchedMovie'
import AddFavoriteMovieValidator from 'App/Validators/AddFavoriteMovieValidator'
import AddWatchedMovieValidator from 'App/Validators/AddWatchedMovieValidator'

export default class MoviesController {

    //Ajout de film en favoris.

    public async addFavorite({auth, request, response} : HttpContextContract) {
        const user = auth.user!

        // Valider la requête avec le validateur AddFavoriteMovie
        const payload = await request.validate(AddFavoriteMovieValidator)

        //On verifie si le film existe déjà dans les favoris
        const exists = await FavoriteMovie.query().where('user_id', user.id).where('movie_id', payload.movieId).first()

        if(exists) {
            return response.badRequest({message : 'Ce film est déjà dans vos favoris !'})
        }

        //Sinon, ajouter le film en favori
        await FavoriteMovie.create({
            userId : user.id,
            movieId : payload.movieId
        })

        return response.ok({message : 'Film ajouté aux favoris !'})
    }


    //Ajouter des films à la liste des déjà regardés.
    public async addWatched({auth, request, response} : HttpContextContract) {

        const user = auth.user!
        // const { movieId } = request.only(['movieId']);
        const payload = await request.validate(AddWatchedMovieValidator)


        const exists = await WatchedMovie.query().where('user_id', user.id).where('movie_id', payload.movieId).first()

        if(exists){
            return response.badRequest({message : "Ce film à déjà été visualisé !"})
        }

        await WatchedMovie.create({
            userId : user.id,
            movieId : payload.movieId
        })

        return response.ok({message : 'Film marqué comme visualisé !'})
    }

    //Récupérer les favoris
    public async getFavorites({ auth, response } : HttpContextContract) {

        const user = auth.user!
        const favorites = await FavoriteMovie.query().where('user_id', user.id)

        return response.ok(favorites)
    }

    public async getWatched({ auth, response } : HttpContextContract) {

        const user = auth.user!
        const watched = await WatchedMovie.query().where('user_id', user.id)

        return response.ok(watched)
    }

    public async removeFavorite({ params, auth, response }: HttpContextContract) {
        const user = auth.user!

        const movieId = params.movieId
        const favorite = await FavoriteMovie.query()
        .where('user_id', user.id)
        .where('movie_id', movieId)
        .first()

        if (!favorite) {
        return response.notFound({ message: "Ce film n'est pas dans vos favoris." })
        }

        await favorite.delete()
        return response.ok({ message: 'Le film a été retiré de vos favoris.' })
    }

    // Suppression de tous les films des favoris
    public async clearFavorites({ auth, response }: HttpContextContract) {
        const user = auth.user!

        const favorites = await FavoriteMovie.query().where('user_id', user.id)

        if (favorites.length === 0) {
            return response.notFound({ message: 'Aucun film trouvé dans vos favoris.' })
        }

        await FavoriteMovie.query().where('user_id', user.id).delete()
        return response.ok({ message: 'Tous les films ont été retirés de vos favoris.' })
    }


    // public async removeFavorite({auth, request, response} : HttpContextContract) {
    //     const user = auth.user!
    //     const payload = await request.validate(AddFavoriteMovieValidator)

    //     const favorite = await FavoriteMovie.query().where('user_id', user.id).where('movie_id', payload.movieId).first()

    //     if(!favorite) {
    //         return response.notFound({message : "Ce film n'est pas dans vos favoris !"})
    //     }
        
    //     favorite.delete()
        
    //     return response.ok({message : 'Film retiré de vos favoris !'})
    // }


    // public async deleteMovieItem({auth, params, response} : HttpContextContract) {
    //     const user = auth.user!
    //     const movieId = params.movieId

    //     // const movie = await FavoriteMovie.findByOrFail('user_id', user.id)
    //     const favorite = await FavoriteMovie.query().where('user_id', user.id).where('movie_id', movieId).first()

    //     if(!favorite) {
    //         return response.notFound({message : "Ce film n'est pas dans vos favoris !"})
    //     }
        
    //     favorite.delete()
        
    //     return response.ok({message : 'Ce film retiré de vos favoris !'})
    // }

    // Suppression d'un seul film des favoris
}
