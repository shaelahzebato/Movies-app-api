import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import User from 'App/Models/User'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'
import UpdatePasswordValidator from 'App/Validators/UpdatePasswordValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
    // Récupérer les informations du profil utilisateur
    public async getProfile({ auth, response }: HttpContextContract) {
        const user = auth.user!

        return response.ok({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    }

    // Mettre à jour les informations du profil
    public async updateProfile({ request, auth, response }: HttpContextContract) {
        const user = auth.user! // Récupère l'utilisateur authentifié
    
        // Valider les données transmises
        const payload = await request.validate(UpdateProfileValidator)
    
        // Mettre à jour le profil utilisateur
        user.merge(payload)
        await user.save()
    
        return response.ok({ message: 'Profil mis à jour avec succès', user })
    }
    // public async updateProfile({ auth, request, response }: HttpContextContract) {
    //     const user = auth.user!
    //     const payload = await request.validate(UpdateProfileValidator)

    //     if (payload.firstname) user.firstname = payload.firstname
    //     if (payload.lastname) user.lastname = payload.lastname
    //     if (payload.email) user.email = payload.email

    //     await user.save()

    //     return response.ok({ message: 'Profil mis à jour avec succès', user })
    // }

    // Mettre à jour le mot de passe
    
    public async updatePassword({ auth, request, response }: HttpContextContract) {
        const user = auth.user!
        const { currentPassword, newPassword } = await request.validate(UpdatePasswordValidator)

        // Vérifier le mot de passe actuel
        const isPasswordValid = await Hash.verify(user.password, currentPassword)
        if (!isPasswordValid) {
            return response.badRequest({ message: 'Mot de passe actuel incorrect' })
        }

        user.password = newPassword
        await user.save()

        return response.ok({ message: 'Mot de passe mis à jour avec succès' })
    }
}