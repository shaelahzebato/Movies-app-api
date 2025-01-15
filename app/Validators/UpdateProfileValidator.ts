import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  
  public schema = schema.create({
    firstname: schema.string.optional({ trim: true }, [rules.minLength(3)]),
    lastname: schema.string.optional({ trim: true }, [rules.minLength(3)]),
    email: schema.string.optional({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }), //, whereNot: { id: auth.user!.id }
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'firstname.minLength': 'Le prénom doit contenir au moins 2 caractères.',
    'lastname.minLength': 'Le nom doit contenir au moins 2 caractères.',
    'email.email': 'Le champ email doit être une adresse valide.',
    'email.unique': 'Cet email est déjà utilisé.',
  }
}
