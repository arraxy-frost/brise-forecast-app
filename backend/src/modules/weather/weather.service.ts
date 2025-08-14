import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface CacheEntry {
    timestamp: number;
    data: any;
}

@Injectable()
export class WeatherService {
    private readonly API_KEY;
    private readonly cache: Map<string, CacheEntry> = new Map();
    private readonly CACHE_TTL = 10 * 60 * 1000; // 10 минут
    private readonly logger = new Logger('WeatherService');

    constructor(private readonly configService: ConfigService) {
        this.API_KEY = this.configService.get<string>('WEATHER_API_KEY');
        console.log('WEATHER_API_KEY', this.API_KEY);
    }

    private getCacheKey(prefix: string, params: string) {
        return `${prefix}:${params}`;
    }

    private checkCache(key: string) {
        const entry = this.cache.get(key);
        if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
            return entry.data;
        }
        return null;
    }

    async getCurrentWeather(city: string) {
        const cacheKey = this.getCacheKey('current', city);
        const cached = this.checkCache(cacheKey);

        if (cached) {
            this.logger.debug(`Restore currentWeather: ${cacheKey}`, );
            return cached;
        }

        try {
            const basePath = 'http://api.weatherapi.com/v1/current.json';
            const response = await axios.get(`${basePath}?key=${this.API_KEY}&q=${city}`);

            this.logger.debug(`Cache currentWeather: ${cacheKey}`);
            this.cache.set(cacheKey, { timestamp: Date.now(), data: response.data });

            return response.data;
        } catch (error: any) {
            throw new HttpException(
                `Weather API error: ${error.message}`,
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    async getDailyAstronomy(city: string, date: string) {
        const cacheKey = this.getCacheKey('astronomy', `${city}:${date}`);
        const cached = this.checkCache(cacheKey);

        if (cached) {
            this.logger.debug(`Restore astronomy: ${cacheKey}`);
            return cached;
        }

        try {
            const basePath = 'http://api.weatherapi.com/v1/astronomy.json';
            const response = await axios.get(`${basePath}?key=${this.API_KEY}&q=${city}&dt=${date}`);

            this.logger.debug(`Cache astronomy: ${cacheKey}`);
            this.cache.set(cacheKey, { timestamp: Date.now(), data: response.data });

            return response.data;
        } catch (error: any) {
            throw new HttpException(
                `Weather API error: ${error.message}`,
                HttpStatus.BAD_GATEWAY,
            );
        }
    }
}
