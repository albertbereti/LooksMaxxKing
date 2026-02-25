
const Stripe = require('stripe');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error("CRITICAL: STRIPE_SECRET_KEY is missing from .env");
    process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
});

// HARDCODED DATA
const HARDWARE_STORE_DB = {
    'gua-sha': {
        id: 'gua-sha',
        name: 'Obsidian Gua Sha',
        description: 'Ancient lymphatic drainage tool. Carved from raw black obsidian to reduce facial puffiness and define cheekbones.',
        numericPrice: 18.99,
        image: 'https://images.unsplash.com/photo-1592136952774-4b5c777d4400?auto=format&fit=crop&q=80&w=800'
    },
    'dermaroller': {
        id: 'dermaroller',
        name: 'Collagen Inducer (1.5mm)',
        description: 'Surgical-grade microneedling tool. Triggers controlled micro-trauma to force the body into a state of hyper-collagenesis.',
        numericPrice: 18.50,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    },
    'ice-roller': {
        id: 'ice-roller',
        name: 'Cryo-Therapy Roller',
        description: 'Morning depuffing essential. Constricts blood vessels to instantly tighten skin and reduce under-eye bags.',
        numericPrice: 14.99,
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800'
    },
    'lumify': {
        id: 'lumify',
        name: 'Lumify Eye Brightener',
        description: 'Pharmaceutical grade eye drops that significantly reduce redness for a high-contrast, healthy gaze.',
        numericPrice: 21.99,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
    },
    'whitening-strips': {
        id: 'whitening-strips',
        name: 'Pro-White Strips',
        description: 'Clinical strength peroxide strips. A bright smile is a non-negotiable status signal.',
        numericPrice: 39.99,
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
    },
    'hyaluronic-serum': {
        id: 'hyaluronic-serum',
        name: 'Pure Hyaluronic 2%',
        description: 'Molecular hydration magnet. Plumps skin cells with water for a glass-skin finish.',
        numericPrice: 16.50,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    },
    'retinol': {
        id: 'retinol',
        name: 'Retinol Clinical 1%',
        description: 'The gold standard of anti-aging. Accelerates cell turnover to erase fine lines and acne scars.',
        numericPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'
    },
    'vitamin-c': {
        id: 'vitamin-c',
        name: 'Vitamin C Brightening',
        description: 'Potent antioxidant serum. Neutralizes free radicals and fades dark spots for an even glow.',
        numericPrice: 22.00,
        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=800'
    },
    'sunscreen': {
        id: 'sunscreen',
        name: 'Invisible Shield SPF 50',
        description: 'The most important anti-aging product. Daily protection prevents 90% of future skin damage.',
        numericPrice: 19.99,
        image: 'https://images.unsplash.com/photo-1526947425960-94d03627ba48?auto=format&fit=crop&q=80&w=800'
    },
    'volufiline': {
        id: 'volufiline',
        name: 'Volufiline Serum',
        description: 'Concentrated Sarsasapogenin extract. Mechanically increases fat cell volume.',
        numericPrice: 28.00,
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800'
    },
    'mastic-gum': {
        id: 'mastic-gum',
        name: 'Mastic Hardware',
        description: 'Premium jawline conditioning hardware. Pure biological resin engineered for facial structure enhancement.',
        numericPrice: 24.99,
        image: 'https://via.placeholder.com/800?text=Mastic+Gum'
    },
    'jawline-exerciser': {
        id: 'jawline-exerciser',
        name: 'Jawline Resistance Unit',
        description: 'Silicone resistance tool for targeted masseter muscle failure training.',
        numericPrice: 12.99,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'
    },
    'tongue-scraper': {
        id: 'tongue-scraper',
        name: 'Steel Tongue Scraper',
        description: 'Surgical steel tool to remove bacterial biofilm. Essential for true breath neutrality.',
        numericPrice: 8.50,
        image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=800'
    },
    'mouthwash': {
        id: 'mouthwash',
        name: 'Therapeutic Mouthwash',
        description: 'Alcohol-free formula that neutralizes sulfur compounds without drying oral tissue.',
        numericPrice: 11.00,
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=800'
    },
    'trimmer': {
        id: 'trimmer',
        name: 'Precision Detailer',
        description: 'Zero-gap t-blade trimmer for barbershop-quality lineups and beard sculpting at home.',
        numericPrice: 45.00,
        image: 'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&q=80&w=800'
    },
    'beard-oil': {
        id: 'beard-oil',
        name: 'Sandalwood Beard Oil',
        description: 'Conditions coarse hair and skin underneath. Prevents "beardruff" and adds a healthy sheen.',
        numericPrice: 15.00,
        image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=800'
    },
    'scalp-brush': {
        id: 'scalp-brush',
        name: 'Scalp Stimulator',
        description: 'Silicone bristled brush to massage the scalp, increase blood flow, and exfoliate during showers.',
        numericPrice: 9.99,
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800'
    },
    'creatine': {
        id: 'creatine',
        name: 'Pure Creatine Monohydrate',
        description: 'The most researched performance supplement. Increases muscle water retention for a fuller look and boosts ATP.',
        numericPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800'
    },
    'collagen': {
        id: 'collagen',
        name: 'Hydrolyzed Collagen Peptides',
        description: 'Building blocks for skin, hair, nails, and joints. Essential for maintaining skin elasticity as you age.',
        numericPrice: 34.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&q=80&w=800'
    },
    'biotin': {
        id: 'biotin',
        name: 'Biotin 10,000mcg',
        description: 'High-dose B7 vitamin to accelerate hair and nail growth rates.',
        numericPrice: 14.00,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
    },
    'zinc': {
        id: 'zinc',
        name: 'Zinc Picolinate',
        description: 'Crucial mineral for testosterone production and acne reduction.',
        numericPrice: 12.00,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800'
    },
    'magnesium': {
        id: 'magnesium',
        name: 'Magnesium Glycinate',
        description: 'The "Chill Mineral". Improves sleep quality and muscle recovery without digestive issues.',
        numericPrice: 18.99,
        image: 'https://images.unsplash.com/photo-1550572017-ed1085c7f8fb?auto=format&fit=crop&q=80&w=800'
    },
    'fish-oil': {
        id: 'fish-oil',
        name: 'Omega-3 Fish Oil',
        description: 'High EPA/DHA formula to lower inflammation and support brain/skin health.',
        numericPrice: 24.00,
        image: 'https://images.unsplash.com/photo-1599447496229-373f7fd076e7?auto=format&fit=crop&q=80&w=800'
    },
    'ghk-cu': {
        id: 'ghk-cu',
        name: 'GHK-Cu Peptide',
        description: 'The ultimate dermal signaling peptide. Reverses skin aging at the DNA level.',
        numericPrice: 45.00,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
    },
    'sauna-blanket': {
        id: 'sauna-blanket',
        name: 'Infrared Sauna Blanket',
        description: 'Personal far-infrared sauna for detox and heat shock protein activation at home.',
        numericPrice: 199.99,
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800'
    },
    'pull-up-bar': {
        id: 'pull-up-bar',
        name: 'Doorway Pull-up Bar',
        description: 'The king of V-taper exercises. Builds the lats for that wide, masculine frame.',
        numericPrice: 35.00,
        image: 'https://images.unsplash.com/photo-1598971639058-211a73287121?auto=format&fit=crop&q=80&w=800'
    },
    'resistance-bands': {
        id: 'resistance-bands',
        name: 'Variable Resistance Bands',
        description: 'Versatile gym-in-a-bag. Perfect for high-rep pump work and mobility.',
        numericPrice: 25.00,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=800'
    },
    'ab-roller': {
        id: 'ab-roller',
        name: 'Ab Roller Wheel',
        description: 'The ultimate core density builder. Forges a blocky, deep six-pack.',
        numericPrice: 18.00,
        image: 'https://images.unsplash.com/photo-1558017487-06bf9f466c8e?auto=format&fit=crop&q=80&w=800'
    },
    'grip-trainer': {
        id: 'grip-trainer',
        name: 'Grip Strength Trainer',
        description: 'Vascularity generator. Builds forearm size and crushing grip strength.',
        numericPrice: 15.00,
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'
    },
    'posture-brace': {
        id: 'posture-brace',
        name: 'Alignment Brace',
        description: 'Retrains proprioception to fix forward head posture and rounded shoulders.',
        numericPrice: 22.00,
        image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800'
    },
    'silk-pillow': {
        id: 'silk-pillow',
        name: 'Mulberry Silk Pillowcase',
        description: 'Anti-friction sleep surface. Prevents sleep wrinkles and hair breakage.',
        numericPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1520183802803-06f731a2059f?auto=format&fit=crop&q=80&w=800'
    },
    'hydro-flask': {
        id: 'hydro-flask',
        name: 'Thermal Hydration Vessel',
        description: 'Vacuum insulated steel. Aesthetic hydration is key for skin and metabolic health.',
        numericPrice: 45.00,
        image: 'https://images.unsplash.com/photo-1602143407151-11115cdca80c?auto=format&fit=crop&q=80&w=800'
    }
};

const syncProducts = async () => {
    console.log("INITIATING STRIPE PRODUCT SYNC (STANDALONE)...");

    // 1. Fetch existing products
    const existingProducts = await stripe.products.list({ limit: 100 });
    const productMap = new Map();
    existingProducts.data.forEach(p => productMap.set(p.name, p));
    console.log(`FOUND ${existingProducts.data.length} EXISTING PRODUCTS.`);

    const outputLinks = {};

    for (const key of Object.keys(HARDWARE_STORE_DB)) {
        const item = HARDWARE_STORE_DB[key];
        console.log(`PROCESSING: ${item.name}...`);

        let stripeProduct = productMap.get(item.name);

        // CREATE if missing
        if (!stripeProduct) {
            console.log(`   -> CREATING NEW PRODUCT: ${item.name}`);
            try {
                stripeProduct = await stripe.products.create({
                    name: item.name,
                    description: item.description,
                    images: item.image.startsWith('http') ? [item.image] : [],
                    metadata: {
                        internal_id: key
                    }
                });
            } catch (err) {
                console.error(`   -> FAILED TO CREATE PRODUCT ${item.name}:`, err.message);
                continue;
            }
        } else {
            console.log(`   -> PRODUCT EXISTS: ${item.name} (${stripeProduct.id})`);
        }

        // SYNC PRICE
        const prices = await stripe.prices.list({ product: stripeProduct.id, active: true, limit: 1 });
        let stripePrice = prices.data[0];
        const targetAmount = Math.round(item.numericPrice * 100);

        if (!stripePrice || stripePrice.unit_amount !== targetAmount) {
            console.log(`   -> CREATING PRICE: $${item.numericPrice}`);
            try {
                stripePrice = await stripe.prices.create({
                    product: stripeProduct.id,
                    unit_amount: targetAmount,
                    currency: 'usd',
                });
            } catch (err) {
                console.error(`   -> FAILED TO CREATE PRICE:`, err.message);
                continue;
            }
        } else {
            console.log(`   -> PRICE OK: $${item.numericPrice}`);
        }

        // GENERATE PAYMENT LINK
        try {
            const paymentLink = await stripe.paymentLinks.create({
                line_items: [
                    { price: stripePrice.id, quantity: 1 }
                ],
                after_completion: {
                    type: 'redirect',
                    redirect: {
                        url: 'https://looksmaxxking.com?success=true'
                    }
                }
            });
            console.log(`   -> LINK GENERATED: ${paymentLink.url}`);
            outputLinks[key] = paymentLink.url;
        } catch (err) {
            console.error(`   -> FAILED TO CREATE LINK:`, err.message);
        }
    }

    // Write to file
    fs.writeFileSync('stripe_payment_links.json', JSON.stringify(outputLinks, null, 2));
    console.log("SUCCESS! Links written to stripe_payment_links.json");
};

syncProducts().catch(console.error);
