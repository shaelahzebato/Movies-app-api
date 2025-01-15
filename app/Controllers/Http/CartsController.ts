import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import CartItem from 'App/Models/CartItem'
import AddToCartValidator from 'App/Validators/AddToCartValidator'
import RemoveFromCartValidator from 'App/Validators/RemoveFromCartValidator'
import UpdateCartItemValidator from 'App/Validators/UpdateCartItemValidator'

export default class CartsController {
    // Ajouter un produit au panier
    public async addToCart({ request, auth, response }: HttpContextContract) {
        const user = auth.user! //S'assurer que l'utilisateur soit connecté

        // Valider les données avec le validateur AddToCartValidator
        const { productId, quantity } = await request.validate(AddToCartValidator)

        // Récupérer ou créer un panier pour l'utilisateur
        const cart = await Cart.firstOrCreate({ userId: user.id })

        // Vérifier si le produit est déjà dans le panier
        const cartItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', productId)
        .first()

        if (cartItem) {
            // Mettre à jour la quantité si le produit existe déjà
            cartItem.quantity += quantity
            await cartItem.save()
        } else {
            // Ajouter un nouvel article
            await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
            })
        }

        return response.ok({ message: 'Produit ajouté au panier' })
    }

    // Retirer un produit du panier
    public async removeFromCart({ request, auth, response }: HttpContextContract) {
        const user = auth.user!

        // Valider les données avec le validateur RemoveFromCart
        const { productId } = await request.validate(RemoveFromCartValidator)

        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findByOrFail('user_id', user.id)

        // Supprimer l'article correspondant
        const cartItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', productId)
        .first()

        if (!cartItem) {
            return response.notFound({ message: 'Produit introuvable dans le panier' })
        }

        await cartItem.delete()

        return response.ok({ message: 'Produit retiré du panier' })
    }

    // Récupérer le contenu du panier
    public async getCart({ auth, response }: HttpContextContract) {
        const user = auth.user!

        const cart = await Cart.query()
        .where('user_id', user.id)
        .preload('items') // Charge les articles liés au panier
        .first()

        if (!cart) {
            return response.ok({ items: [] })
        }

        return response.ok(cart)
    }

    // Modifier la quantité d'un produit dans le panier
    public async updateCartItem({ request, params, auth, response }: HttpContextContract) {
        const user = auth.user!
        const productId = params.productId // ID du produit dans l'URL

        const payload = await request.validate(UpdateCartItemValidator)

        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findByOrFail('user_id', user.id)

        // Trouver le produit dans le panier
        const cartItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', productId)
        .first()

        if (!cartItem) {
            return response.notFound({ message: 'Produit introuvable dans le panier' })
        }

        // Mettre à jour la quantité
        cartItem.quantity = payload.quantity
        await cartItem.save()

        return response.ok({ message: 'Quantité mise à jour', cartItem })
    }

    // Supprimer un produit spécifique du panier
    public async deleteCartItem({ params, auth, response }: HttpContextContract) {
        const user = auth.user!
        const productId = params.productId // ID du produit dans l'URL

        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findByOrFail('user_id', user.id)

        // Trouver et supprimer le produit dans le panier
        const cartItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', productId)
        .first()

        if (!cartItem) {
            return response.notFound({ message: 'Produit introuvable dans le panier' })
        }

        await cartItem.delete()

        return response.ok({ message: 'Produit supprimé du panier' })
    }

    // // Modifier la quantité d'un produit dans le panier
    // public async updateCartItem({ request, params, auth, response }: HttpContextContract) {
    //     const user = auth.user!
    //     const productId = params.productId // ID du produit dans l'URL
    //     const { quantity } = request.only(['quantity']) // Nouvelle quantité depuis le body

    //     // Valider que la quantité est un nombre positif
    //     if (!Number.isInteger(quantity) || quantity <= 0) {
    //     return response.badRequest({ message: 'La quantité doit être un entier positif' })
    //     }

    //     // Récupérer le panier de l'utilisateur
    //     const cart = await Cart.findByOrFail('user_id', user.id)

    //     // Trouver le produit dans le panier
    //     const cartItem = await CartItem.query()
    //     .where('cart_id', cart.id)
    //     .where('product_id', productId)
    //     .first()

    //     if (!cartItem) {
    //     return response.notFound({ message: 'Produit introuvable dans le panier' })
    //     }

    //     // Mettre à jour la quantité
    //     cartItem.quantity = quantity
    //     await cartItem.save()

    //     return response.ok({ message: 'Quantité mise à jour', cartItem })
    // }

    // // Supprimer un produit spécifique du panier
    // public async deleteCartItem({ params, auth, response }: HttpContextContract) {
    //     const user = auth.user!
    //     const productId = params.productId // ID du produit dans l'URL

    //     // Récupérer le panier de l'utilisateur
    //     const cart = await Cart.findByOrFail('user_id', user.id)

    //     // Trouver et supprimer le produit dans le panier
    //     const cartItem = await CartItem.query()
    //     .where('cart_id', cart.id)
    //     .where('product_id', productId)
    //     .first()

    //     if (!cartItem) {
    //     return response.notFound({ message: 'Produit introuvable dans le panier' })
    //     }

    //     await cartItem.delete()

    //     return response.ok({ message: 'Produit supprimé du panier' })
    // }
}