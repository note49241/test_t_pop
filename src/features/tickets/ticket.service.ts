import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { User, UserDocument } from 'src/models/user.model'
import { Event, EventDocument } from 'src/models/event.model'
import { EventUser, EventUserDocument } from 'src/models/event-user.model'
import { Ticket, TicketDocument } from 'src/models/ticket.model'

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(EventUser.name)
    private readonly eventUserModel: Model<EventUserDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
    private readonly configService: ConfigService
  ) {}

  async createTicket(body) {
    try {
      const { event_id, ticket_limit, ticket_zone, ticket_no } = body

      const ticketNo = []

      for (let i = 1; i <= ticket_no; i++) {
        const seatNumber: string = ticket_zone + i
        ticketNo.push({ event_id: event_id, ticket_limit: ticket_limit, ticket_zone: ticket_zone, ticket_no: seatNumber, status: false, create_dt: new Date() })
      }

      const data = this.ticketModel.insertMany(ticketNo)

      return data
    } catch (err) {
      if (err.response) throw err
      throw new HttpException(
        {
          meta: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 3,
            message: 'พบข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง'
          }
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async updateTicket(body) {
    try {
      const { event_id, ticket_id, ticket_no, user_id, status } = body

      const checkDupTicket = await this.eventModel.count({ event_id: event_id, ticket_id: ticket_id, delete_flag: false, ticket_no: ticket_no })

      if (checkDupTicket >= 1) {
        throw new ConflictException({
          meta: {
            code: HttpStatus.CONFLICT,
            status: 2,
            message: `ชื่อ ${ticket_no} นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนใหม่`
          }
        })
      }

      const res = await this.eventModel.findOneAndUpdate(
        {
          ticket_id: ticket_id
        },
        {
          $set: {
            status: status,
            update_dt: new Date()
          }
        },
        { new: true, upsert: true }
      )

      const result = new this.eventUserModel({
        event_id: event_id,
        user_id: user_id,
        ticket_no: ticket_no,
        create_dt: new Date()
      }).save()

      return res
    } catch (err) {
      if (err.response) throw err
      throw new HttpException(
        {
          meta: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 3,
            message: 'พบข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง'
          }
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getlist() {
    try {
      return await this.ticketModel.find({ delete_flag: false }).sort({ _id: -1 })
    } catch (err) {
      if (err.response) throw err
      throw new HttpException(
        {
          meta: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 3,
            message: 'พบข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง'
          }
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
