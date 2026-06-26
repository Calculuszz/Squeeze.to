import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { ClickService } from './click.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LinksController],
  providers: [LinksService, ClickService],
})
export class LinksModule {}
