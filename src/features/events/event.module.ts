import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose'
import { Event, EventSchema } from 'src/models/event.model'
import { EventUser, EventUserSchema } from 'src/models/event-user.model'
import * as AutoIncrementFactory from 'mongoose-sequence'
import { Connection } from 'mongoose'
import { EventService } from './event.service'
import { EventController } from './event.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: async (connection: Connection) => {
          const schema = EventSchema
          const AutoIncrement = AutoIncrementFactory(connection)
          schema.plugin(AutoIncrement, { inc_field: 'event_id' })
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
  controllers: [EventController],
  providers: [EventService],
  exports: []
})
export class EventModule {}
