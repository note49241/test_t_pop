import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document } from 'mongoose'

export type TicketDocument = Ticket & Document
@Schema()
export class Ticket {
  @Prop({ unique: true })
  uid: string
  @Prop({ unique: true })
  ticket_id: number
  @Prop({ required: true })
  event_id: string
  @Prop({ required: true })
  ticket_limit: number
  @Prop({ required: true })
  ticket_zone: string
  @Prop({ required: true })
  ticket_no: string
  @Prop({ required: true })
  status: boolean
  @Prop({ default: false, required: false })
  delete_flag: boolean
  @Prop()
  create_dt: Date
  @Prop()
  update_dt: Date
}

export const TicketSchema = SchemaFactory.createForClass(Ticket)
