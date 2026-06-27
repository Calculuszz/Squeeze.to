import { ApiProperty } from '@nestjs/swagger';

export class ShortenResponseDto {
  @ApiProperty({ example: 'a4Bk9', description: 'Base62-encoded short code' })
  shortCode: string;

  @ApiProperty({
    example: 'https://squeeze-to.onrender.com/a4Bk9',
    description: 'Full short URL ready to share',
  })
  shortUrl: string;

  @ApiProperty({
    example: 'https://www.example.com/very/long/path',
    description: 'Original long URL that was shortened',
  })
  longUrl: string;
}
