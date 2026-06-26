import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { encode } from '../common/base62';

@Injectable()
export class LinksService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Create a shortened link.
   *
   * Flow:
   * 1. Insert row with a placeholder short_code to get auto-generated id
   * 2. Encode id → base62 short_code
   * 3. Update row with the real short_code
   *
   * Two round-trips is acceptable per CLAUDE.md.
   */
  async create(longUrl: string) {
    // Step 1: Insert with placeholder to obtain the auto-increment id
    const { data: inserted, error: insertError } = await this.supabase
      .getClient()
      .from('links')
      .insert({ long_url: longUrl, short_code: '__pending__' })
      .select('id')
      .single();

    if (insertError || !inserted) {
      throw new InternalServerErrorException(
        `Failed to insert link: ${insertError?.message}`,
      );
    }

    const id = BigInt(inserted.id);
    const shortCode = encode(id);

    // Step 2: Update with the real short_code
    const { error: updateError } = await this.supabase
      .getClient()
      .from('links')
      .update({ short_code: shortCode })
      .eq('id', inserted.id);

    if (updateError) {
      throw new InternalServerErrorException(
        `Failed to update short_code: ${updateError.message}`,
      );
    }

    const baseUrl = this.config.get<string>('BASE_URL', 'http://localhost:3000');

    return {
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`,
      longUrl,
    };
  }

  /**
   * Resolve a short code to its long URL.
   * Throws NotFoundException if code doesn't exist.
   */
  async resolve(shortCode: string): Promise<string> {
    const { data, error } = await this.supabase
      .getClient()
      .from('links')
      .select('long_url')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Short code "${shortCode}" not found`);
    }

    return data.long_url;
  }

  /**
   * Get stats for a short code (click count, etc.)
   */
  async getStats(shortCode: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('links')
      .select('short_code, long_url, click_count, created_at')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Short code "${shortCode}" not found`);
    }

    return {
      shortCode: data.short_code,
      longUrl: data.long_url,
      clickCount: data.click_count,
      createdAt: data.created_at,
    };
  }
}
