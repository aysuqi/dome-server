import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 删除敏感信息
 */
@Injectable()
export class RemoveSensitiveInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('RemoveSensitiveInfoInterceptor:')
    // console.log(`Controller: ${context.getClass().name}`); // 输出
    // console.log(`Method: ${context.getHandler().name}`);
    // const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((res) => {
        res = JSON.parse(JSON.stringify(res));
        this.delValue(res, 'password');
        this.delValue(res, 'salt');
        return res;
      }),
    );
  }

  delValue(data, targetKey) {
    for (const key in data) {
      if (key === targetKey) {
        delete data[key];
      } else if (typeof data[key] === 'object') {
        this.delValue(data[key], targetKey);
      }
    }
  }
}
