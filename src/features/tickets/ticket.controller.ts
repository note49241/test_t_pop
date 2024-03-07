import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { TicketService } from './ticket.service'

@Controller('user')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getList() {
    return this.ticketService.getlist()
  }

  @Post()
  async createTicket(@Body() body) {
    return await this.ticketService.createTicket(body)
  }

  @Patch()
  async updateTicket(@Body() body) {
    return await this.ticketService.updateTicket(body)
  }
}
