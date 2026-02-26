import crypto from "crypto"

import { db } from "@/lib/db"

// Verify Dodo Payments webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")
    const expectedFull = `sha256=${expected}`
    // Timing-safe comparison prevents timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedFull)
    )
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("webhook-signature") ?? ""
  const payload = await req.text()

  // 1. Always verify the webhook signature first
  const secret = process.env.DODO_WEBHOOK_SECRET
  if (!secret) {
    console.error("[dodo/webhook] DODO_WEBHOOK_SECRET is not set")
    return new Response("Server misconfiguration", { status: 500 })
  }

  const isValid = verifySignature(payload, signature, secret)
  if (!isValid) {
    console.warn("[dodo/webhook] Invalid signature — possible spoofed webhook")
    return new Response("Invalid signature", { status: 401 })
  }

  let event: { type: string; data: Record<string, string> }
  try {
    event = JSON.parse(payload)
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  // 2. Handle payment success → grant Pro access
  if (event.type === "payment.succeeded" || event.type === "subscription.activated") {
    const { customer_email, customer_id, payment_id, product_id } = event.data

    if (!customer_email) {
      return new Response("Missing customer_email", { status: 400 })
    }

    await db.user.upsert({
      where: { email: customer_email },
      update: {
        isPro: true,
        plan: "lifetime",
        planActivatedAt: new Date(),
        dodoCustomerId: customer_id,
        dodoPaymentId: payment_id,
      },
      create: {
        email: customer_email,
        isPro: true,
        plan: "lifetime",
        planActivatedAt: new Date(),
        dodoCustomerId: customer_id,
        dodoPaymentId: payment_id,
      },
    })

    console.log(`[dodo/webhook] ✓ Pro activated for ${customer_email} (product: ${product_id})`)
  }

  // 3. Handle refund/chargeback → revoke Pro access
  if (event.type === "payment.refunded" || event.type === "subscription.cancelled") {
    const { customer_email } = event.data
    if (customer_email) {
      await db.user.update({
        where: { email: customer_email },
        data: { isPro: false, plan: null },
      })
      console.log(`[dodo/webhook] ✗ Pro revoked for ${customer_email}`)
    }
  }

  return new Response("OK", { status: 200 })
}
