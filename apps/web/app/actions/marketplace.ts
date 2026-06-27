'use server'

import { prisma } from '@repo/database'
import { revalidatePath } from 'next/cache'
import { MARKETPLACE_ITEMS, MarketplaceItem } from '@repo/game-logic/marketplace'
import { getCurrentUser } from './auth'

export interface PurchaseResult {
  success: boolean
  message: string
  newGoldBalance?: number
}

export async function purchaseRewardItem(itemId: string): Promise<PurchaseResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Not authenticated.' }
  }

  // Find item definition — trust only server-side catalog
  const item: MarketplaceItem | undefined = MARKETPLACE_ITEMS.find((i: MarketplaceItem) => i.id === itemId)
  if (!item) {
    return { success: false, message: 'Invalid item.' }
  }

  // Fetch current gold balance
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  })

  if (!profile) {
    return { success: false, message: 'Could not fetch profile.' }
  }

  const currentGold: number = profile.gold
  if (currentGold < item.cost) {
    return { success: false, message: 'Insufficient gold coins.' }
  }

  // Deduct gold and record purchase inside transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Deduct gold
      await tx.profile.update({
        where: { id: user.id },
        data: { gold: currentGold - item.cost },
      })

      // Record purchase
      await tx.purchasedReward.create({
        data: {
          profileId: user.id,
          itemId: item.id,
          itemName: item.name,
          itemCategory: item.category,
          cost: item.cost,
        },
      })
    })

    revalidatePath('/marketplace')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: `Successfully redeemed: ${item.name}!`,
      newGoldBalance: currentGold - item.cost,
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to complete transaction.' }
  }
}

export async function getMarketplaceData() {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { gold: true, name: true, level: true },
    })

    const history = await prisma.purchasedReward.findMany({
      where: { profileId: user.id },
      orderBy: { purchasedAt: 'desc' },
      take: 20,
    })

    return {
      profile: profile ? {
        gold: profile.gold,
        username: profile.name,
        rank_title: `Level ${profile.level} Hunter`,
      } : null,
      history: history.map(h => ({
        ...h,
        purchased_at: h.purchasedAt.toISOString(),
        item_name: h.itemName,
      })),
    }
  } catch (err) {
    return null
  }
}
