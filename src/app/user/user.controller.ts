import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ResponseModel } from '../common/models';
import { AuthGuard } from '../common/guards';
import { UserId } from '../common/decorators';
import { UserService } from './user.service';
import { UserResponseModel } from './models/user-response.model';

@Controller('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/me')
  @ApiOkResponse({
    type: ResponseModel,
    description: 'Get current user login',
  })
  public async getMe(@UserId() userId: number): Promise<ResponseModel> {
    const user = await this.userService.findUserByIdOrFail(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new ResponseModel(UserResponseModel.fromEntity(user), 'Success');
  }
}