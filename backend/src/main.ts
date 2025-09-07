import { NestFactory } from '@nestjs/core';
import { Injectable, Controller, Get, Module } from '@nestjs/common';

@Injectable()
class AppService {
  getHello(): string {
    return 'Hello World from NestJS Backend!';
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck(): string {
    return 'OK';
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();