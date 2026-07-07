import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as xss from 'xss';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  
  private xssFilter = new xss.FilterXSS({
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body) {
      this.sanitizeObject(request.body);
    }
    
    if (request.query) {
      this.sanitizeObject(request.query);
    }
    
    if (request.params) {
      this.sanitizeObject(request.params);
    }

    return next.handle();
  }

  private sanitizeObject(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    // La contraseña no se sanitiza
    const camposIgnorados = ['contrasena', 'contrasena_actual', 'nueva_contrasena', 'password'];

    for (const key in obj) {
      if (camposIgnorados.includes(key.toLowerCase())) {
        continue;
      }

      if (typeof obj[key] === 'string') {
        obj[key] = this.xssFilter.process(obj[key]);
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key]);
      }
    }
  }
}