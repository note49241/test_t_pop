import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document } from 'mongoose'

export type EventUserDocument = EventUser & Document
@Schema()
export class EventUser {
  @Prop({ unique: true })
  uid: string
  @Prop({ required: true })
  event_id: number
  @Prop({ required: true })
  user_id: number
  @Prop({ required: true })
  ticket_no: string
  @Prop({ default: false, required: false })
  delete_flag: boolean
  @Prop()
  create_dt: Date
  @Prop()
  update_dt: Date
}

export const EventUserSchema = SchemaFactory.createForClass(EventUser)
