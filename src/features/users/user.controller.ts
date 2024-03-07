import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() body) {
    return this.userService.loginUser(body)
  }

  @Post('/register')
  async register(@Body() body) {
    return this.userService.createUser(body)
  }
}
