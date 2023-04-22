import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  test() {
    return { text: 'test system-service' };
  }
}
