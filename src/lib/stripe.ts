import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-02-24' as Stripe.LatestApiVersion,
})
