import { DateTime } from 'luxon'
import { BaseModel, column, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { hasMany } from '@ioc:Adonis/Lucid/Orm'
import CartItem from './CartItem'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @hasMany(() => CartItem) // Relation "un à plusieurs"
  public items: HasMany<typeof CartItem>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
