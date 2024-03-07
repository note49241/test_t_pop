import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

import { User, UserDocument } from 'src/models/user.model'
import { EventUser, EventUserDocument } from 'src/models/event-user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(EventUser.name)
    private readonly eventUserModel: Model<EventUserDocument>,
    private readonly configService: ConfigService
  ) {}

  async createUser(body) {
    try {
      const { email, firstname, lastname, password } = body

      const checkDupUser = await this.userModel.count({
        delete_flag: false,
        email: email.toLowerCase()
      })
      if (checkDupUser == 1) {
        throw new ConflictException({
          meta: {
            code: HttpStatus.CONFLICT,
            status: 2,
            message: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเปลี่ยนอีเมลใหม่'
          }
        })
      }

      const salt = await bcrypt.genSalt(12)
      const passSalt = Math.floor(Math.random() * 1000000000 + 1)
      const hash = await bcrypt.hash(passSalt + password, salt)

      const data = new this.userModel({
        email: email.toLowerCase(),
        firstname: firstname,
        lastname: lastname,
        password: hash,
        pass_salt: passSalt
      })
      const result = await this.userModel.create(data)

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

  async loginUser(body) {
    try {
      const { email, password } = body

      const user = await this.userModel.findOne({
        delete_flag: false,
        email: email.toLowerCase()
      })
      const isMatch = await bcrypt.compare(user.pass_salt + password, user.password)
      if (!isMatch) {
        throw new HttpException(
          {
            meta: {
              code: HttpStatus.OK,
              status: 3,
              message: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน'
            }
          },
          HttpStatus.OK
        )
      }

      const payload = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
      const token = await jwt.sign(payload, this.configService.get('ACCESS_TOKEN_USER_KEY'), { expiresIn: '7d' })

      const event_user = await this.eventUserModel.find({
        delete_flag: false,
        user_id: user.uid
      })

      return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        event: event_user ?? [],
        token: token
      }
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
