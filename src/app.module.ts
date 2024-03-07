import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { MongooseConfig } from './config/mongoose.config'
import { UserModule } from './features/users/user.module'
import { EventModule } from './features/events/event.module'
import { TicketModule } from './features/tickets/ticket.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync(MongooseConfig), UserModule, EventModule, TicketModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
