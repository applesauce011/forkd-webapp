const RC_BASE = 'https://api.revenuecat.com/v1'
const RC_KEY = process.env.REVENUECAT_SECRET_KEY!

export async function grantRevenueCatEntitlement(
  userId: string,
  email: string | null,
  stripeSubscriptionId: string
) {
  await fetch(`${RC_BASE}/subscribers/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RC_KEY}`,
      'Content-Type': 'application/json',
      'X-Platform': 'stripe',
    },
    body: JSON.stringify({ app_user_id: userId, attributes: { $email: { value: email } } }),
  })

  await fetch(`${RC_BASE}/subscribers/${userId}/entitlements/premium/promotional`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RC_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      duration: 'monthly',
      stripe_product_id: stripeSubscriptionId,
    }),
  })
}

export async function revokeRevenueCatEntitlement(userId: string) {
  await fetch(`${RC_BASE}/subscribers/${userId}/entitlements/premium/revoke_promotionals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RC_KEY}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getRevenueCatPremiumStatus(userId: string): Promise<boolean> {
  const res = await fetch(`${RC_BASE}/subscribers/${userId}`, {
    headers: { Authorization: `Bearer ${RC_KEY}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) return false
  const data = await res.json()
  const expiry = data.subscriber?.entitlements?.premium?.expires_date
  return expiry ? new Date(expiry) > new Date() : false
}
