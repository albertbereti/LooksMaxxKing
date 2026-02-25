
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { HARDWARE_STORE_DB } from '../data/supplyChain';

// Load env vars
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error("CRITICAL: STRIPE_SECRET_KEY is missing from .env");
    process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Use latest stable
});

const syncProducts = async () => {
    console.log("INITIATING STRIPE PRODUCT SYNC...");

    // 1. Fetch existing products to avoid duplicates
    // Note: In a real robust script we'd use pagination, but for <100 items this is fine (limit 100 default)
    const existingProducts = await stripe.products.list({ limit: 100 });
    const productMap = new Map(existingProducts.data.map(p => [p.name, p]));

    console.log(`FOUND ${existingProducts.data.length} EXISTING PRODUCTS.`);

    for (const [key, item] of Object.entries(HARDWARE_STORE_DB)) {
        console.log(`PROCESSING: ${item.name}...`);

        let stripeProduct = productMap.get(item.name);

        // CREATE if missing
        if (!stripeProduct) {
            console.log(`   -> CREATING NEW PRODUCT: ${item.name}`);
            stripeProduct = await stripe.products.create({
                name: item.name,
                description: item.description,
                images: [item.image],
                metadata: {
                    pillar: item.pillar,
                    benefit: item.benefitTag
                }
            });
        } else {
            console.log(`   -> PRODUCT EXISTS: ${item.name} (${stripeProduct.id})`);
        }

        // SYNC PRICE (Simplification: We create a new price if we can't easily find a matching active one)
        // For this script, we'll just ensure ONE price exists.
        const prices = await stripe.prices.list({ product: stripeProduct.id, active: true, limit: 1 });
        let stripePrice = prices.data[0];

        const targetAmount = Math.round(item.numericPrice * 100); // Cents

        if (!stripePrice || stripePrice.unit_amount !== targetAmount) {
            console.log(`   -> CREATING PRICE: $${item.numericPrice}`);
            stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: targetAmount,
                currency: 'usd',
            });
        } else {
            console.log(`   -> PRICE OK: $${item.numericPrice}`);
        }

        // GENERATE PAYMENT LINK
        // We want a permanent checkout link for this product
        // Check if one exists? (Stripe API doesn't easily list payment links by product)
        // We will just create a new one for now and output it.
        // In a real app we might store this in a local JSON to map back.

        // Let's create a payment link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                { price: stripePrice.id, quantity: 1 }
            ],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://looksmaxxking.com?success=true' // Update with real domain
                }
            }
        });

        console.log(`   -> LINK GENERATED: ${paymentLink.url}`);

        // Log to a file locally so we can update supplyChain.ts
        // Format: ID: LINK
    }
};

syncProducts().catch(console.error);
