import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @column()
  public productId: number

  @column()
  public quantity: number

  @belongsTo(() => Cart) // Relation inverse : "plusieurs à un"
  public cart: BelongsTo<typeof Cart>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
