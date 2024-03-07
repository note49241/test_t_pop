import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document } from 'mongoose'

export type UserDocument = User & Document
@Schema()
export class User {
  @Prop({ unique: true })
  uid: string
  @Prop({ unique: true })
  user_id: number
  @Prop({ required: true })
  email: string
  @Prop({ required: true })
  firstname: string
  @Prop({ required: true })
  lastname: string
  @Prop({ required: true })
  password: string
  @Prop({ required: true })
  pass_salt: string
  @Prop({ default: false, required: false })
  delete_flag: boolean
  @Prop()
  create_dt: Date
  @Prop()
  update_dt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
