import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { LinksService } from './links.service';
import { ClickService } from './click.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { ShortenResponseDto } from './dto/shorten-response.dto';
import { StatsResponseDto } from './dto/stats-response.dto';

@ApiTags('Links')
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
  @ApiOperation({
    summary: 'Shorten a URL',
    description:
      'Accepts a long URL and returns a base62-encoded short code with the full short URL.',
  })
  @ApiResponse({
    status: 201,
    description: 'Link shortened successfully',
    type: ShortenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid URL format' })
  @ApiResponse({ status: 500, description: 'Database error' })
  async create(@Body() dto: CreateLinkDto) {
    return this.linksService.create(dto.url);
  }

  /**
   * GET /links/:code/stats — Get click stats for a short code
   */
  @Get('links/:code/stats')
  @ApiOperation({
    summary: 'Get link statistics',
    description:
      'Returns click count, original URL, and creation date for a given short code.',
  })
  @ApiParam({
    name: 'code',
    example: 'a4Bk9',
    description: 'The base62 short code',
  })
  @ApiResponse({
    status: 200,
    description: 'Stats retrieved successfully',
    type: StatsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Short code not found' })
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
  @ApiExcludeEndpoint()
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

