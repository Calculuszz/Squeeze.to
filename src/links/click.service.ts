import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Separated click-counting service.
 *
 * Design decision: isolated so we can swap the storage backend
 * (e.g. Redis, message queue) without touching the redirect path.
 */
@Injectable()
export class ClickService {
  private readonly logger = new Logger(ClickService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Atomically increment click_count for a given short code.
   * Designed to be called fire-and-forget — callers should NOT await this.
   *
   * Uses a Postgres RPC function for atomic increment
   * (Supabase JS client cannot express `SET col = col + 1` natively).
   */
  async recordClick(shortCode: string): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .rpc('increment_click_count', { code: shortCode });

    if (error) {
      // Fire-and-forget: log but never throw — losing a click is acceptable
      this.logger.error(
        `Failed to record click for "${shortCode}": ${error.message}`,
      );
    }
  }
}
