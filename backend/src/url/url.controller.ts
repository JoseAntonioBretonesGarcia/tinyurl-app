import { Body, Controller, Get, HttpException, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import { isValidUrl } from '../utils/urlValidator';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/urls')
  async createUrl(
    @Body('originalUrl') originalUrl: string,
    @Body('customAlias') customAlias?: string,
    @Body('expiresAt') expiresAt?: string | null,
    @Body('allowDuplicates') allowDuplicates?: boolean,
    @Req() req?: Request,
  ) {
    if (!originalUrl || !isValidUrl(originalUrl)) {
      throw new HttpException('URL inválida', 400);
    }

    const created = await this.urlService.createShortUrl(
      originalUrl,
      customAlias,
      expiresAt || null,
      allowDuplicates ?? false,
    );

    const baseUrl = process.env.BASE_URL || `${req?.protocol}://${req?.get('host')}`;

    return {
      shortCode: created.short_code,
      shortUrl: `${baseUrl}/${created.short_code}`,
      originalUrl: created.original_url,
      expiresAt: created.expires_at,
    };
  }

  @Get('api/urls/:shortCode/stats')
  async getStats(@Param('shortCode') shortCode: string) {
    const stats = await this.urlService.getStats(shortCode);
    if (!stats) {
      throw new HttpException('No encontrado', 404);
    }
    return stats;
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlService.getByShortCode(shortCode);
    if (!url) {
      res.status(404).send('URL no encontrada o expirada');
      return;
    }

    this.urlService
      .registerHit(url.id, {
        referrer: res.req.get('referer') || undefined,
        userAgent: res.req.get('user-agent') || undefined,
        ip: res.req.ip,
      })
      .catch(console.error);

    res.redirect(302, url.original_url);
  }
}
