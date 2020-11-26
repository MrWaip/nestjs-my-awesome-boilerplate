import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { LOCALE_COOKIE, LOCALE_HEADER } from '../constants';

export type ErrorRresponse = {
  statusCode: number;
  message: any;
};

@Catch(HttpException)
export class ExceptionI18nFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const lang = request.cookies[LOCALE_COOKIE] || request.get(LOCALE_HEADER);
    const message = await this.i18n.t(exception.message, { lang });
    const responseBody: ErrorRresponse = {
      statusCode,
      message,
    };

    response.status(statusCode).json(responseBody);
  }
}
