import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { LinksService } from './links.service';
import { ClickService } from './click.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller()
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly clickService: ClickService,
  ) {}

  /**
   * POST /links — Create a short link
   */
  @Post('links')
  async create(@Body() dto: CreateLinkDto) {
    return this.linksService.create(dto.url);
  }

  /**
   * GET /links/:code/stats — Get click stats for a short code
   */
  @Get('links/:code/stats')
  async stats(@Param('code') code: string) {
    return this.linksService.getStats(code);
  }

  /**
   * GET /:code — Redirect to the long URL (302)
   *
   * Fire-and-forget click counting: we intentionally do NOT await
   * recordClick so that the redirect response is never delayed by
   * the click counter. A lost click is acceptable.
   */
  @Get(':code')
  async redirect(
    @Param('code') code: string,
    @Res() res: import('express').Response,
  ) {
    const longUrl = await this.linksService.resolve(code);

    // Fire-and-forget — do NOT await
    this.clickService.recordClick(code);

    // 302 Found — not 301, so browser always comes back (countable + revocable)
    res.redirect(HttpStatus.FOUND, longUrl);
  }
}
