import { invokeEdgeFunction } from './edge.service';
import { emitCommEvent } from '@/communication';

export async function sendBusinessCampaign({
  businessId,
  message,
  campaignType = 'winback',
  customerIds = null,
  targetSegment = null,
  businessName = null,
}) {
  const result = await invokeEdgeFunction('send-business-campaign', {
    businessId,
    message,
    campaignType,
    customerIds,
    targetSegment,
  });

  if (result?.sent > 0) {
    emitCommEvent('business_campaign_sent', {
      payload: {
        businessId,
        campaignType,
        targetSegment,
        sent: result.sent,
        pushed: result.pushed,
        message: message?.slice(0, 120),
        title: businessName ? `${businessName} te extraña` : 'Campaña comercio',
        body: message,
        storePath: result.storePath,
      },
    }).catch(() => {});
  }

  return result;
}

export async function getBusinessCampaignHistory(businessId, { limit = 20 } = {}) {
  const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
  if (!isSupabaseConfigured || !businessId) return [];
  const { data, error } = await supabase
    .from('business_customer_campaigns')
    .select('id, customer_id, message, campaign_type, created_at')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
