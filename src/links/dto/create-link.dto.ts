import { IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'url must be a valid HTTP or HTTPS URL' },
  )
  url: string;
}
