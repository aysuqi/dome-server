import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  /**
   * 图形验证码
   * @param size
   * @returns
   */
  async createCaptcha(size = 4) {
    const captcha = svgCaptcha.create({
      size,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#cc9966',
    });

    return captcha;
  }
}
