import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/models/user.model'
import { EventUser, EventUserSchema } from 'src/models/event-user.model'
import * as AutoIncrementFactory from 'mongoose-sequence'
import { Connection } from 'mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (connection: Connection) => {
          const schema = UserSchema
          const AutoIncrement = AutoIncrementFactory(connection)
          schema.plugin(AutoIncrement, { inc_field: 'user_id' })
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
  controllers: [UserController],
  providers: [UserService],
  exports: []
})
export class UserModule {}
