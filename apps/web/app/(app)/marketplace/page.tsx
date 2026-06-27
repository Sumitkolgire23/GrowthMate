'use client'

import { useState, useTransition } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MARKETPLACE_ITEMS,
  MarketplaceCategory,
  MarketplaceItem,
} from '@repo/game-logic/marketplace'
import { purchaseRewardItem, getMarketplaceData } from '../../actions/marketplace'

const CATEGORIES: { key: MarketplaceCategory; label: string; icon: string; color: string }[] = [
  { key: 'learning', label: 'Learning Credits', icon: '🎓', color: '#06b6d4' },
  { key: 'wellness', label: 'Wellness', icon: '🌿', color: '#10b981' },
  { key: 'career', label: 'Career Boosts', icon: '💼', color: '#a855f7' },
  { key: 'social', label: 'Social / Team', icon: '🤝', color: '#f59e0b' },
]

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>('learning')
  const [isPending, startTransition] = useTransition()
  const [purchasedItemId, setPurchasedItemId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [redemptionModal, setRedemptionModal] = useState<MarketplaceItem | null>(null)

  // Fetch marketplace data (gold balance and history) in one request
  const { data: marketplaceData, refetch } = useQuery<any>({
    queryKey: ['marketplace_data'],
    queryFn: async () => {
      const data = await getMarketplaceData();
      if (!data) throw new Error('Failed to load marketplace data');
      return data;
    }
  });

  const profile = marketplaceData?.profile;
  const history = marketplaceData?.history || [];

  const filteredItems = MARKETPLACE_ITEMS.filter(i => i.category === activeCategory)
  const gold = profile?.gold ?? 0

  async function handlePurchase(item: MarketplaceItem) {
    setPurchasedItemId(item.id)
    setFeedback(null)
    startTransition(async () => {
      const result = await purchaseRewardItem(item.id)
      if (result.success) {
        setFeedback({ type: 'success', message: result.message })
        setRedemptionModal(item)
        refetch()
      } else {
        setFeedback({ type: 'error', message: result.message })
      }
      setPurchasedItemId(null)
    })
  }

  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", padding: '2rem 1.5rem' }}>
      {/* Redemption Modal */}
      {redemptionModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={() => setRedemptionModal(null)}
        >
          <div
            style={{
              background: '#0f172a', border: '1px solid #06b6d4', borderRadius: '16px',
              padding: '2.5rem', maxWidth: '480px', width: '100%',
              boxShadow: '0 0 60px rgba(6,182,212,0.25)',
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{redemptionModal.icon}</div>
            <h2 style={{ textAlign: 'center', fontSize: '1.3rem', color: '#06b6d4', marginBottom: '0.75rem' }}>
              ✅ Reward Unlocked!
            </h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              <strong style={{ color: '#e2e8f0' }}>{redemptionModal.name}</strong>
            </p>
            <div style={{
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.85rem', color: '#7dd3fc', lineHeight: 1.7, margin: 0 }}>
                <strong>📋 How to Redeem:</strong><br />
                {redemptionModal.redemptionNote}
              </p>
            </div>
            <button
              onClick={() => setRedemptionModal(null)}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                border: 'none', cursor: 'pointer',
              }}
            >
              Got it! Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes goldPulse { 0%,100% { box-shadow: 0 0 12px rgba(251,191,36,0.4); } 50% { box-shadow: 0 0 28px rgba(251,191,36,0.7); } }
        @keyframes scanline { 0% { background-position: 0 0; } 100% { background-position: 0 100vh; } }
        .shop-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 0 30px rgba(6,182,212,0.25) !important; }
        .shop-card { transition: all 0.25s ease; }
        .cat-tab:hover { opacity: 1 !important; }
        .buy-btn:hover:not(:disabled) { filter: brightness(1.2); transform: scale(1.03); }
        .buy-btn { transition: all 0.2s ease; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '2rem' }}>🏪</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Growth Marketplace
              </h1>
            </div>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
              Spend your hard-earned Gold Coins on real-world rewards. Every item requires genuine effort.
            </p>
          </div>

          {/* Gold Balance HUD */}
          <div style={{
            background: '#0f172a', border: '1px solid #fbbf24',
            borderRadius: '14px', padding: '1rem 1.75rem',
            animation: 'goldPulse 2.5s ease-in-out infinite',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              Gold Coins
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🪙</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
                {gold.toLocaleString()}
              </span>
            </div>
            {profile?.rank_title && (
              <span style={{ fontSize: '0.7rem', color: '#a855f7', marginTop: '0.2rem' }}>
                {profile.rank_title}
              </span>
            )}
          </div>
        </div>

        {/* ── Feedback Banner ─────────────────────────────────────────────── */}
        {feedback && (
          <div style={{
            padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '1.5rem',
            background: feedback.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: feedback.type === 'success' ? '#34d399' : '#f87171',
            fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>{feedback.type === 'success' ? '✅' : '❌'} {feedback.message}</span>
            <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
        )}

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                className="cat-tab"
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '50px',
                  border: `1px solid ${isActive ? cat.color : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? `${cat.color}18` : 'rgba(15,23,42,0.7)',
                  color: isActive ? cat.color : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isActive ? 1 : 0.7,
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            )
          })}
        </div>

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{activeCat.icon}</span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: activeCat.color }}>
            {activeCat.label}
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#334155', background: '#1e293b', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
            {filteredItems.length} items
          </span>
        </div>

        {/* ── Item Grid ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {filteredItems.map(item => {
            const canAfford = gold >= item.cost
            const isBuying = isPending && purchasedItemId === item.id
            return (
              <div
                key={item.id}
                className="shop-card"
                style={{
                  background: '#0f172a',
                  border: `1px solid ${canAfford ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Corner glow for affordable items */}
                {canAfford && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '60px', height: '60px',
                    background: 'radial-gradient(circle at top right, rgba(6,182,212,0.15), transparent)',
                    pointerEvents: 'none',
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    fontSize: '2rem', width: '52px', height: '52px',
                    background: '#1e293b', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🪙</span>
                    <span style={{
                      fontSize: '1.2rem', fontWeight: 800,
                      color: canAfford ? '#fbbf24' : '#475569',
                    }}>
                      {item.cost.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>gold</span>
                  </div>

                  <button
                    className="buy-btn"
                    disabled={!canAfford || isBuying || isPending}
                    onClick={() => handlePurchase(item)}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: canAfford
                        ? 'linear-gradient(135deg, #06b6d4, #0ea5e9)'
                        : '#1e293b',
                      color: canAfford ? '#fff' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: canAfford && !isPending ? 'pointer' : 'not-allowed',
                      opacity: isBuying ? 0.7 : 1,
                    }}
                  >
                    {isBuying ? '⚡ Redeeming...' : canAfford ? '🛒 Redeem' : '🔒 Need more gold'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Purchase History ────────────────────────────────────────────── */}
        <div style={{
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '1.75rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: '#94a3b8' }}>
            📜 Redemption History
          </h2>

          {!history || history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#334155' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗂️</div>
              <p style={{ margin: 0 }}>No rewards redeemed yet. Complete quests to earn Gold Coins!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(history as any[]).map((entry: any) => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.9rem 1rem',
                    background: '#020617', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap', gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>
                      {entry.item_name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                      {new Date(entry.purchased_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1rem' }}>🪙</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>-{entry.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
