import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('/current')
    async getCurrentWeather(@Query('city') city: string) {
        return await this.weatherService.getCurrentWeather(city);
    }

    @Get('/astronomy')
    async getDailyAstronomy(@Query('city') city: string, @Query('date') date: string) {
        return await this.weatherService.getDailyAstronomy(city, date);
    }
}
