import crypto from "crypto"

import { db } from "@/lib/db"

/**
 * Polar.sh Webhook Handler
 *
 * Events handled:
 * - checkout.created: Customer completed checkout
 * - subscription.created: Subscription activated
 * - subscription.updated: Subscription changed (upgrade/downgrade)
 * - subscription.canceled: Subscription canceled
 * - order.created: One-time purchase completed
 *
 * Setup:
 * 1. Go to Polar Dashboard → Settings → Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhooks/polar
 * 3. Copy the webhook secret to POLAR_WEBHOOK_SECRET
 */

// Verify Polar webhook signature (HMAC SHA-256)
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")

    // Polar sends signature as hex string
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    return false
  }
}

// Polar webhook event types
interface PolarWebhookEvent {
  type: string
  data: {
    id: string
    customer_id?: string
    customer_email?: string
    product_id?: string
    product?: {
      id: string
      name: string
      metadata?: Record<string, string>
    }
    subscription?: {
      id: string
      status: string
      customer_id: string
    }
    user?: {
      id: string
      email: string
    }
    metadata?: Record<string, string>
  }
}

// Map Polar product to plan type
function getPlanFromProduct(productId: string): "pro" | "team" | null {
  const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID
  const teamProductId = process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID

  if (productId === proProductId) return "pro"
  if (productId === teamProductId) return "team"
  return null
}

export async function POST(req: Request) {
  const signature = req.headers.get("polar-signature") ??
                    req.headers.get("webhook-signature") ?? ""
  const payload = await req.text()

  // 1. Verify webhook signature
  const secret = process.env.POLAR_WEBHOOK_SECRET
  if (!secret) {
    console.error("[polar/webhook] POLAR_WEBHOOK_SECRET is not set")
    return new Response("Server misconfiguration", { status: 500 })
  }

  const isValid = verifySignature(payload, signature, secret)
  if (!isValid) {
    console.warn("[polar/webhook] Invalid signature — possible spoofed webhook")
    return new Response("Invalid signature", { status: 401 })
  }

  let event: PolarWebhookEvent
  try {
    event = JSON.parse(payload)
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  console.log(`[polar/webhook] Received event: ${event.type}`)

  // 2. Handle checkout/order completion → grant access
  if (
    event.type === "checkout.created" ||
    event.type === "order.created" ||
    event.type === "subscription.created"
  ) {
    const customerEmail = event.data.customer_email ?? event.data.user?.email
    const customerId = event.data.customer_id ?? event.data.user?.id
    const productId = event.data.product_id ?? event.data.product?.id
    const subscriptionId = event.data.subscription?.id ?? event.data.id

    if (!customerEmail) {
      console.error("[polar/webhook] Missing customer email")
      return new Response("Missing customer email", { status: 400 })
    }

    const plan = productId ? getPlanFromProduct(productId) : "pro"

    await db.user.upsert({
      where: { email: customerEmail },
      update: {
        isPro: true,
        plan: plan ?? "pro",
        planActivatedAt: new Date(),
        polarCustomerId: customerId,
        polarSubscriptionId: subscriptionId,
      },
      create: {
        email: customerEmail,
        isPro: true,
        plan: plan ?? "pro",
        planActivatedAt: new Date(),
        polarCustomerId: customerId,
        polarSubscriptionId: subscriptionId,
      },
    })

    console.log(`[polar/webhook] ✓ ${plan ?? "pro"} access granted to ${customerEmail}`)
  }

  // 3. Handle subscription updates (upgrade/downgrade)
  if (event.type === "subscription.updated") {
    const customerEmail = event.data.customer_email ?? event.data.user?.email
    const productId = event.data.product_id ?? event.data.product?.id

    if (customerEmail && productId) {
      const plan = getPlanFromProduct(productId)
      if (plan) {
        await db.user.update({
          where: { email: customerEmail },
          data: { plan },
        })
        console.log(`[polar/webhook] ✓ Plan updated to ${plan} for ${customerEmail}`)
      }
    }
  }

  // 4. Handle cancellation/refund → revoke access
  if (
    event.type === "subscription.canceled" ||
    event.type === "subscription.revoked" ||
    event.type === "order.refunded"
  ) {
    const customerEmail = event.data.customer_email ?? event.data.user?.email

    if (customerEmail) {
      await db.user.update({
        where: { email: customerEmail },
        data: {
          isPro: false,
          plan: null,
          polarSubscriptionId: null,
        },
      })
      console.log(`[polar/webhook] ✗ Access revoked for ${customerEmail}`)
    }
  }

  return new Response("OK", { status: 200 })
}
