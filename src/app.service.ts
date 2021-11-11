import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello GET World!';
  }

  postHello(): string {
    return 'Hello POST World!';
  }

  postScada(companyName: string, scadaData: any[]): string {
    return companyName + ' has length ' + scadaData.length;
  }
}
