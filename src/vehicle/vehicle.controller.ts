import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import Vehicle from '../database/entities/vehicle.entity';
import { UserService } from '../user/user.service';
import { VehicleService } from './vehicle.service';
import { VehicleType } from '../misc/constants';
import { getEmailFromCookie } from 'src/misc/helper';
class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  mass_x?: number;

  @IsOptional()
  @IsNumber()
  mass_y?: number;

  @IsOptional()
  @IsNumber()
  mass_z?: number;

  @IsOptional()
  @IsNumber()
  weigth?: number;
}

class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  mass_x: number;

  @IsNotEmpty()
  @IsNumber()
  mass_y: number;

  @IsNotEmpty()
  @IsNumber()
  mass_z: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createVehicle(
    @Headers('cookie') cookie: string,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null) {
      throw new HttpException(
        `user could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const vehicle = await Vehicle.of(
      user.id,
      createVehicleDto.name,
      createVehicleDto.type,
      createVehicleDto.model,
      createVehicleDto.mass_x,
      createVehicleDto.mass_y,
      createVehicleDto.mass_z,
      createVehicleDto.weight,
    );
    await vehicle.save();
    return vehicle;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':email/:name')
  async updateVehicle(
    @Param('email') email: string,
    @Param('name') name: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(email, name, updateVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async all(@Headers('cookie') cookie: string) {
    const email = getEmailFromCookie(cookie);
    return this.vehicleService.getVehicles(email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':email/:name')
  async deleteVehicle(
    @Param('email') email: string,
    @Param('name') name: string,
  ) {
    return this.vehicleService.deleteVehicle(email, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email/:name')
  async vehicleExists(
    @Param('email') email: string,
    @Param('name') name: string,
  ): Promise<boolean> {
    const vehicle = await this.vehicleService.findByEmailAndName(email, name);
    const exists = vehicle !== undefined && vehicle !== null;
    return exists;
  }
}
