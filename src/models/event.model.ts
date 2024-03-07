import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document } from 'mongoose'

export type EventDocument = Event & Document
@Schema()
export class Event {
  @Prop({ unique: true })
  uid: string
  @Prop({ unique: true })
  event_id: number
  @Prop({ required: true })
  event_name: string
  @Prop({ required: true })
  event_description: string
  @Prop({ required: true })
  event_date: Date
  @Prop({ required: true })
  event_time_start: string
  @Prop({ required: true })
  event_time_end: string
  @Prop({ default: false, required: false })
  delete_flag: boolean
  @Prop()
  create_dt: Date
  @Prop()
  update_dt: Date
}

export const EventSchema = SchemaFactory.createForClass(Event)
