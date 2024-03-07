import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/models/user.model'
import { Event, EventSchema } from 'src/models/event.model'
import { EventUser, EventUserSchema } from 'src/models/event-user.model'
import { Ticket, TicketSchema } from 'src/models/ticket.model'
import * as AutoIncrementFactory from 'mongoose-sequence'
import { Connection } from 'mongoose'
import { TicketService } from './ticket.service'
import { TicketController } from './ticket.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeatureAsync([
      {
        name: Ticket.name,
        useFactory: async (connection: Connection) => {
          const schema = TicketSchema
          const AutoIncrement = AutoIncrementFactory(connection)
          schema.plugin(AutoIncrement, { inc_field: 'ticket_id' })
          return schema
        },
        inject: [getConnectionToken()]
      },
      {
        name: Event.name,
        useFactory: () => {
          const schema = EventSchema
          return schema
        },
        inject: [getConnectionToken()]
      },
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema
          return schema
        },
        inject: [getConnectionToken()]
      },
      {
        name: EventUser.name,
        useFactory: () => {
          const schema = EventUserSchema
          return schema
        },
        inject: [getConnectionToken()]
      }
    ])
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: []
})
export class TicketModule {}
