import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: 'price_xxx', // ID du prix Stripe (test)
        quantity: 1,
      },
    ],
    success_url: `${req.headers.origin}/Profil?success=true`,
    cancel_url: `${req.headers.origin}/Profil?canceled=true`,
  });
  res.status(200).json({ url: session.url });
}