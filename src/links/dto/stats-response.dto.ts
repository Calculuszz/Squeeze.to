import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty({ example: 'a4Bk9', description: 'Base62-encoded short code' })
  shortCode: string;

  @ApiProperty({
    example: 'https://www.example.com/very/long/path',
    description: 'Original long URL',
  })
  longUrl: string;

  @ApiProperty({ example: 42, description: 'Total number of redirect clicks' })
  clickCount: number;

  @ApiProperty({
    example: '2026-06-27T10:00:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt: string;
}
