'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MARKETPLACE_ITEMS, MarketplaceItem } from '@repo/game-logic/marketplace'

export interface PurchaseResult {
  success: boolean
  message: string
  newGoldBalance?: number
}

export async function purchaseRewardItem(itemId: string): Promise<PurchaseResult> {
  const supabase = (await createClient()) as any

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, message: 'Not authenticated.' }
  }

  // Find item definition — trust only server-side catalog, never client input
  const item: MarketplaceItem | undefined = MARKETPLACE_ITEMS.find((i: MarketplaceItem) => i.id === itemId)
  if (!item) {
    return { success: false, message: 'Invalid item.' }
  }

  // Fetch current gold balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('gold')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, message: 'Could not fetch profile.' }
  }

  const currentGold: number = (profile as any).gold
  if (currentGold < item.cost) {
    return { success: false, message: 'Insufficient gold coins.' }
  }

  // Deduct gold
  const { error: deductError } = await supabase
    .from('profiles')
    .update({ gold: currentGold - item.cost })
    .eq('id', user.id)

  if (deductError) {
    return { success: false, message: 'Failed to deduct gold.' }
  }

  // Record purchase
  const { error: insertError } = await supabase
    .from('purchased_rewards')
    .insert({
      profile_id: user.id,
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      cost: item.cost,
    })

  if (insertError) {
    // Rollback gold deduction
    await supabase
      .from('profiles')
      .update({ gold: currentGold })
      .eq('id', user.id)
    return { success: false, message: 'Failed to record purchase. Gold refunded.' }
  }

  revalidatePath('/marketplace')
  revalidatePath('/dashboard')

  return {
    success: true,
    message: `Successfully redeemed: ${item.name}!`,
    newGoldBalance: currentGold - item.cost,
  }
}
