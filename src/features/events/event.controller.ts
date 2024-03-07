import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { EventService } from './event.service'

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/list')
  async getList() {
    return await this.eventService.getList()
  }

  @Post('/create_event')
  async create_event(@Body() body) {
    return await this.eventService.createEvent(body)
  }

  @Patch('/update_event')
  async update_event(@Body() body) {
    return await this.eventService.updateEvent(body)
  }
}
