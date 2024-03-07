import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Event, EventDocument } from 'src/models/event.model'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly configService: ConfigService
  ) {}

  async createEvent(body) {
    try {
      const { event_name, event_description, event_date, event_time_start, event_time_end } = body

      const checkDupEvent = await this.eventModel.count({ delete_flag: false, event_name: event_name })

      if (checkDupEvent >= 1) {
        throw new ConflictException({
          meta: {
            code: HttpStatus.CONFLICT,
            status: 2,
            message: `ชื่อ ${event_name} นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนใหม่`
          }
        })
      }

      const data = new this.eventModel({
        event_name: event_name,
        event_description: event_description,
        event_date: event_date,
        event_time_start: event_time_start,
        event_time_end: event_time_end,
        create_dt: new Date()
      }).save()

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

  async getList() {
    try {
      const result = await this.eventModel.find({ delete_flag: false }).sort({ _id: -1 })

      return result
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

  async updateEvent(body) {
    try {
      const { event_id, event_name, event_description, event_date, event_time_start, event_time_end } = body

      const checkDupEvent = await this.eventModel.count({ event_id: { $ne: event_id }, delete_flag: false, event_name: event_name })

      if (checkDupEvent >= 1) {
        throw new ConflictException({
          meta: {
            code: HttpStatus.CONFLICT,
            status: 2,
            message: `ชื่อ ${event_name} นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนใหม่`
          }
        })
      }

      const res = await this.eventModel.findOneAndUpdate(
        {
          event_id: event_id
        },
        {
          $set: {
            event_name: event_name,
            event_description: event_description,
            event_date: event_date,
            event_time_start: event_time_start,
            event_time_end: event_time_end,
            update_dt: new Date()
          }
        },
        { new: true, upsert: true }
      )

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
}
