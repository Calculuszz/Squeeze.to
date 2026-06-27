import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({
    example: 'https://www.example.com/very/long/path?query=param',
    description: 'The long URL to shorten. Must be a valid HTTP or HTTPS URL.',
  })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'url must be a valid HTTP or HTTPS URL' },
  )
  url: string;
}
