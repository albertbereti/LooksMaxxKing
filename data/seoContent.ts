
import { BlogPost } from "../types";
import { AMAZON_TAG } from "../config";

// Helper to generate Amazon Search Links
const link = (text: string, query?: string) => {
    const q = query || text;
    return `<a href="https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-amber-500 font-bold underline decoration-blue-500/30 hover:decoration-amber-500 transition-all cursor-pointer">${text}</a>`;
};

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "jawline-guide",
        slug: "how-to-get-sharp-jawline-men",
        title: "The Ultimate Guide to a Sharp Jawline: Mastic Gum, Mewing, and Hardmaxxing",
        publishDate: "2024-03-15",
        keywords: ["how to get sharp jawline", "mastic gum", "mewing guide", "jawline exercises", "masseter hypertrophy", "gonial angle"],
        excerpt: "Forget genetics. Learn the proven protocols to widen your masseters, reduce water retention, and carve a jawline of stone.",
        content: `
            <h2>The Science of the Jaw</h2>
            <p>A sharp jawline isn't just about low body fat; it's about structure. The ideal male aesthetic features a wide bi-gonial width (the distance between the jaw angles) and a forward-projected chin. If you weren't born with it, you can engineer it.</p>
            
            <h3>1. Masseter Hypertrophy (The Muscle)</h3>
            <p>Just like your biceps, your jaw muscles (masseters) grow with resistance training. The modern diet is too soft. To combat this, you need ${link("Mastic Gum", "Mastic Gum for Jawline")}. It is 10x harder than regular gum and provides the resistance needed for hypertrophy.</p>
            <ul>
                <li><strong>Protocol:</strong> Chew ${link("Mastic Gum")} for 30-60 minutes daily.</li>
                <li><strong>Alternative:</strong> Use a ${link("Jawliner", "Jaw exercise silicone")} silicone tool if gum is unavailable.</li>
                <li><strong>Expected Result:</strong> Visible widening of the lower third within 3-4 weeks.</li>
            </ul>

            <h3>2. Mewing (The Structure)</h3>
            <p>Dr. Mike Mew's orthotropic premise is simple: tongue posture dictates facial growth. If your tongue rests on the floor of your mouth, your maxilla (upper jaw) narrows, leading to a weak chin and double chin.</p>
            <ul>
                <li><strong>Technique:</strong> Press the entire surface of your tongue against the roof of your mouth.</li>
                <li><strong>Suction Hold:</strong> Create a vacuum to keep it there unconsciously.</li>
                <li><strong>Consistency:</strong> 24/7, even while sleeping.</li>
            </ul>

            <h3>3. Debloating (The Definition)</h3>
            <p>You might have a great jaw hidden under water retention. Sodium and cortisol are the enemies.</p>
            <ul>
                <li>Drink 4L of water daily.</li>
                <li>Increase Potassium intake.</li>
                <li>Use an ${link("Ice Roller")} every morning to depuff the lymphatic fluid.</li>
                <li>Take ${link("Dandelion Root Extract")} as a natural diuretic.</li>
            </ul>

            <p><strong>Want to know if your jawline potential is unlocked? Use our AI Scanner to analyze your Gonial Angle now.</strong></p>
        `
    },
    {
        id: "hunter-eyes-guide",
        slug: "hunter-eyes-vs-prey-eyes",
        title: "Hunter Eyes vs. Prey Eyes: Canthal Tilt and Eyelid Exposure Explained",
        publishDate: "2024-03-18",
        keywords: ["hunter eyes", "canthal tilt", "upper eyelid exposure", "hooded eyes", "positive canthal tilt", "orbital vector"],
        excerpt: "The single most important indicator of facial dominance. We break down the science of the eye area and how to improve it.",
        content: `
            <h2>What are Hunter Eyes?</h2>
            <p>"Hunter Eyes" characterize a specific orbital structure that is biologically associated with high testosterone and dominance. Key features include:</p>
            <ul>
                <li><strong>Positive Canthal Tilt:</strong> The outer corner of the eye is higher than the inner corner.</li>
                <li><strong>Minimal Upper Eyelid Exposure (UEE):</strong> The hooding of the brow covers the upper eyelid.</li>
                <li><strong>Deep Set Orbits:</strong> The eyes sit further back in the skull, protected by the brow ridge.</li>
            </ul>

            <h2>Prey Eyes: The Opposite</h2>
            <p>Prey eyes typically have a negative canthal tilt (downturned eyes), significant scleral show (white visible under the iris), and bulging eyes. This signals fear or submission subconsciously.</p>

            <h2>Can You Change Your Eyes?</h2>
            <h3>Softmaxxing (Non-Surgical)</h3>
            <ul>
                <li><strong>Volufiline:</strong> Some users report applying ${link("Volufiline Oil")} to the upper eyelid to increase fat pad density, mimicking hooding.</li>
                <li><strong>Squintmaxxing:</strong> Strengthening the orbicularis oculi muscle through controlled squinting exercises.</li>
                <li><strong>Ice Hooding:</strong> Using ${link("Ice Eye Masks")} to reduce eyelid puffiness.</li>
                <li><strong>Eyelash Growth:</strong> Longer lashes create the illusion of a darker, more protected eye area. Use ${link("Castor Oil")} or ${link("Latisse generic", "eyelash growth serum")} nightly.</li>
            </ul>

            <h3>Hardmaxxing (Surgical)</h3>
            <p>For those serious about reconstruction:</p>
            <ul>
                <li><strong>Canthoplasty:</strong> Surgically tightening the outer corner to increase tilt.</li>
                <li><strong>Orbital Decompression:</strong> Setting the eyes deeper into the skull.</li>
                <li><strong>Infraorbital Implants:</strong> Adding bone support under the eye to reduce scleral show.</li>
            </ul>
        `
    },
    {
        id: "skincare-glass-skin",
        slug: "men-skincare-routine-glass-skin",
        title: "The 'American Psycho' Routine: Achieving Glass Skin for Men",
        publishDate: "2024-03-20",
        keywords: ["glass skin men", "retinol guide", "korean sunscreen", "collagen production", "remove acne scars"],
        excerpt: "Skin texture determines 40% of your facial attractiveness score. Here is the scientifically backed routine to remove flaws.",
        content: `
            <h2>Texture is Everything</h2>
            <p>You can have perfect bone structure, but inflamed, scarred, or dull skin will tank your SMV (Sexual Market Value). The goal is "Glass Skin" - smooth, uniform, and reflective.</p>

            <h3>The Holy Trinity of Skincare</h3>
            
            <h4>1. Retinoids (The Engine)</h4>
            <p>Vitamin A derivatives speed up cell turnover. They force your skin to create new, healthy cells faster than old ones die.</p>
            <ul>
                <li><strong>Start with:</strong> ${link("Adapalene Gel 0.1%")} (Differin) or a high quality ${link("Retinol Serum")}.</li>
                <li><strong>Frequency:</strong> Nightly.</li>
                <li><strong>Benefit:</strong> Reduces wrinkles, fights acne, fades scars.</li>
            </ul>

            <h4>2. Sunscreen (The Shield)</h4>
            <p>UV rays destroy collagen. If you aren't wearing SPF 50, don't bother with the rest. We recommend <strong>Korean Sunscreens</strong> like ${link("Beauty of Joseon Sunscreen")} because they don't leave a white cast and give a glow.</p>

            <h4>3. Hydration (The Glow)</h4>
            <p>Use a ${link("Hyaluronic Acid Serum")} on damp skin. This molecule holds 1000x its weight in water, plumping the skin and hiding fine lines.</p>

            <h3>Advanced Tools</h3>
            <ul>
                <li><strong>Microneedling:</strong> Using a ${link("Dr. Pen Microneedling Device")} or a simple ${link("Derma Roller")} forces collagen repair. Great for deep acne scars.</li>
                <li><strong>Snail Mucin:</strong> ${link("COSRX Snail Mucin 96")} is a K-Beauty staple for repairing the moisture barrier.</li>
                <li><strong>Clean Towels:</strong> Never reuse a towel. Use ${link("Disposable Face Towels")} to prevent bacteria transfer.</li>
            </ul>
        `
    },
    {
        id: "hair-growth-protocol",
        slug: "norwood-reaper-hair-loss-protocol",
        title: "Defeating the Norwood Reaper: A Scientific Protocol for Hair Regrowth",
        publishDate: "2024-03-22",
        keywords: ["minoxidil beard", "finasteride", "derma stamping hair", "hairline recession", "rosemary oil"],
        excerpt: "Hair loss is not a choice. Balding is optional. The Big 3 protocol explained for hairline recovery and beard density.",
        content: `
            <h2>The Mechanism of Loss</h2>
            <p>Male Pattern Baldness (MPB) is caused by DHT (Dihydrotestosterone) attacking hair follicles. To stop it, you must block DHT and stimulate blood flow.</p>

            <h3>The Big 3 Protocol</h3>
            
            <h4>1. Finasteride (The Blocker)</h4>
            <p>A prescription medication that stops testosterone from converting into DHT. It halts the loss. Without this, you are fighting a losing battle. Consult a doctor.</p>

            <h4>2. Minoxidil (The Fertilizer)</h4>
            <p>It extends the "Anagen" (growth) phase of hair. It doesn't stop loss, but it forces regrowth. Use ${link("Rogaine Foam", "Minoxidil 5% Foam")} to avoid dandruff caused by liquid versions.</p>

            <h4>3. Microneedling (The Soil Aeration)</h4>
            <p>Using a ${link("Derma Stamp 1.5mm")} once a week creates micro-injuries. When the body heals these, it sends growth factors to the scalp. Studies show Microneedling + Minoxidil is 4x more effective than Minoxidil alone.</p>

            <h3>Natural Adjuvants</h3>
            <ul>
                <li>${link("Rosemary Oil Mielle")}: Shown in some studies to rival 2% Minoxidil.</li>
                <li>${link("Ketoconazole Shampoo", "Nizoral Shampoo")}: An anti-fungal that mildly blocks scalp DHT.</li>
                <li>${link("Biotin Supplements")}: Supports keratin infrastructure.</li>
            </ul>
        `
    },
    {
        id: "dimorphic-features",
        slug: "sexual-dimorphism-face",
        title: "Sexual Dimorphism: What Makes a Face Masculine?",
        publishDate: "2024-03-25",
        keywords: ["sexual dimorphism", "fwhr", "facial width to height ratio", "brow ridge", "chin projection", "masculine face traits"],
        excerpt: "The biology of attraction. Understanding FWHR, midface ratios, and what truly signals masculinity to the female brain.",
        content: `
            <h2>The Biology of Attraction</h2>
            <p>Attraction isn't subjective; it's mathematical. It is driven by Sexual Dimorphism—how distinct your features are from the opposite sex.</p>

            <h3>Key Metrics of Masculinity</h3>

            <h4>1. FWHR (Facial Width-to-Height Ratio)</h4>
            <p>Divide the width of your face (bizygomatic width) by the height of your midface (upper lip to brow). A ratio of <strong>1.9 or higher</strong> is correlated with high testosterone and dominance.</p>

            <h4>2. The Midface Ratio</h4>
            <p>A compact midface is ideal. A long midface (from eyes to mouth) creates a tired, "horse-face" appearance. Mewing helps shorten the perceived midface by upswinging the maxilla.</p>

            <h4>3. Brow Ridge Prominence</h4>
            <p>A deep, heavy brow ridge creates a shadow over the eyes (Hunter Eyes). This is a primal sign of protection and aggression capability.</p>

            <h3>How to Increase Dimorphism</h3>
            <ul>
                <li><strong>Lower Body Fat:</strong> Reveals the bone structure. Aim for 10-12%.</li>
                <li><strong>Neck Training:</strong> A thick neck implies strength. Train your sternocleidomastoid muscles using a ${link("Neck Harness")} or lying plate curls.</li>
                <li><strong>Beard:</strong> Artificial dimorphism. It adds width and length to the jaw, simulating bone. Use ${link("Beard Dye")} to make it denser and more dominant.</li>
            </ul>
        `
    },
    {
        id: "eyebrow-maxxing",
        slug: "eyebrow-density-shape-men",
        title: "Eyebrow Maxxing: The High-Contrast Frame",
        publishDate: "2024-04-01",
        keywords: ["eyebrow growth", "men eyebrows", "minoxidil eyebrows", "castor oil", "eyebrow dye"],
        excerpt: "Your eyebrows frame your eyes. Weak, sparse brows make you look submissive. Here is the protocol for thick, dark, positive-tilt brows.",
        content: `
            <h2>The Importance of the Brow</h2>
            <p>Dark, dense, and low-set eyebrows create a high-contrast look that increases facial dominance. "Invisible" blond or sparse brows wash out your features.</p>

            <h3>The Growth Protocol</h3>
            <ul>
                <li><strong>Minoxidil:</strong> Yes, you can apply a tiny amount of ${link("Minoxidil Liquid")} to your brows. Be careful not to let it drip.</li>
                <li><strong>Castor Oil:</strong> A safer, natural alternative. Apply ${link("Jamaican Black Castor Oil")} nightly to thicken hairs.</li>
                <li><strong>Derma Stamping:</strong> Use a smaller ${link("Derma Stamp 0.5mm")} on the brow ridge to stimulate follicles.</li>
            </ul>

            <h3>The Color Protocol</h3>
            <p>Even if you have hair, it might be too light. Dyeing your brows is the highest ROI softmax you can do.</p>
            <ul>
                <li>Use ${link("Just For Men Beard Dye")} (Dark Brown or Black).</li>
                <li>Apply for 3-5 minutes only.</li>
                <li>Wipe off. Instantly adds 2 points to your eye area.</li>
            </ul>
        `
    },
    {
        id: "neck-training-guide",
        slug: "how-to-get-thicker-neck",
        title: "The Stack of Dimes: Why You Need a Thick Neck",
        publishDate: "2024-04-05",
        keywords: ["neck training", "thick neck exercises", "neck harness", "sternocleidomastoid", "pencil neck"],
        excerpt: "A pencil neck destroys an otherwise good physique. A thick neck commands respect instantly. How to add 2 inches to your neck safely.",
        content: `
            <h2>The Sign of Power</h2>
            <p>The neck is the only muscle group visible when you are fully clothed (in a suit or t-shirt). A wide neck signals high testosterone and physical capability.</p>
            <p>Ideally, your neck should be wider than your jaw and align with your ears.</p>

            <h3>The Workout</h3>
            <p>Treat the neck like any other muscle. 3 sets of 12-15 reps.</p>
            
            <h4>1. Neck Curls (Front)</h4>
            <p>Lie on a bench with your head hanging off. Place a weight plate on your forehead (with a towel). Curl your chin to your chest.</p>
            
            <h4>2. Neck Extensions (Back)</h4>
            <p>Lie face down or use a ${link("Neck Harness")}. Extend your head up and back. This builds the yoke.</p>

            <h4>3. Lateral Raises</h4>
            <p>Do not neglect the sides. Use manual resistance with your hand or a band.</p>

            <p><strong>Warning:</strong> Start light. The neck is sensitive. Do not ego lift.</p>
        `
    },
    {
        id: "smellmaxxing-guide",
        slug: "guide-to-smelling-good-men",
        title: "Smellmaxxing: The Invisible Halo Effect",
        publishDate: "2024-04-10",
        keywords: ["best cologne for men", "pheromone soap", "tongue scraper", "oral hygiene", "body wash"],
        excerpt: "Scent bypasses logic and hits the limbic system directly. How to curate a signature scent and eliminate all bad odors.",
        content: `
            <h2>Hygiene First, Fragrance Second</h2>
            <p>No amount of expensive cologne covers up bad hygiene. It just mixes to create a worse smell.</p>

            <h3>The Baseline Protocol</h3>
            <ul>
                <li><strong>Tongue Scraping:</strong> 90% of bad breath comes from the white coating on your tongue. Use a ${link("Stainless Steel Tongue Scraper")} every morning.</li>
                <li><strong>TheraBreath:</strong> Standard mouthwash burns but doesn't work. Use ${link("TheraBreath Dentist Formulated")} to neutralize sulfur bacteria.</li>
                <li><strong>Body Wash:</strong> Use a high-quality ${link("Antibacterial Body Wash")} or ${link("Dr. Squatch Soap")} for natural exfoliation.</li>
            </ul>

            <h3>Fragrance Tier List</h3>
            <p>Invest in an Eau de Parfum (EDP) for longevity, not an Eau de Toilette (EDT).</p>
            <ul>
                <li><strong>Daily Driver:</strong> ${link("Dior Sauvage Elixir")} or ${link("Bleu de Chanel Parfum")}.</li>
                <li><strong>Date Night:</strong> ${link("Versace Eros Flame")} or ${link("La Nuit De L'Homme")}.</li>
                <li><strong>Niche (King Tier):</strong> ${link("Creed Aventus")} or ${link("Tom Ford Tobacco Vanille")}.</li>
            </ul>
        `
    },
    {
        id: "sleepmaxxing-hgh",
        slug: "sleep-optimization-hgh-testosterone",
        title: "Sleepmaxxing: Maximizing HGH and Symmetry Overnight",
        publishDate: "2024-04-12",
        keywords: ["mouth taping", "silk pillowcase", "magnesium glycinate", "sleep hygiene", "hgh production"],
        excerpt: "You grow and repair when you sleep. Poor sleep equals low testosterone and cortisol bloat. Here is the optimal sleep stack.",
        content: `
            <h2>The Night Shift</h2>
            <p>Sleep is when your body releases Human Growth Hormone (HGH). If you sleep 6 hours, you are leaving gains on the table.</p>

            <h3>The Sleep Stack</h3>
            
            <h4>1. Mouth Taping</h4>
            <p>Mouth breathing ruins your jawline (recessed chin) and sleep quality (apnea). Force nasal breathing by using ${link("Mouth Tape for Sleeping")}. It is life-changing for energy levels.</p>

            <h4>2. Silk Pillowcases</h4>
            <p>Cotton creates friction, leading to sleep lines (wrinkles) and hair breakage. Sleep on a ${link("100% Mulberry Silk Pillowcase")} to protect your skin and hair.</p>

            <h4>3. Magnesium Glycinate</h4>
            <p>Most men are deficient. Taking 400mg of ${link("Magnesium Glycinate")} before bed lowers cortisol and deepens REM sleep. Do not use Citrate (laxative effect).</p>

            <h4>4. Nasal Strips</h4>
            <p>Open your airways mechanically with ${link("Breathe Right Nasal Strips")} to maximize oxygen intake.</p>
        `
    },
    {
        id: "teethmaxxing-smile",
        slug: "white-teeth-straight-teeth-guide",
        title: "Teethmaxxing: The Hollywood Smile Protocol",
        publishDate: "2024-04-15",
        keywords: ["teeth whitening strips", "water flosser", "orthodontics", "mewing teeth", "white teeth"],
        excerpt: "Yellow, crooked teeth signal poor health. A white, wide smile is a status symbol. How to upgrade your smile for under $50.",
        content: `
            <h2>The High-Status Smile</h2>
            <p>A wide dental arch supports the midface. Crooked teeth suggest a narrow palate (mouth breathing).</p>

            <h3>Whitening Protocol</h3>
            <p>You don't need expensive dentist treatments.</p>
            <ul>
                <li><strong>Strips:</strong> Use ${link("Crest 3D Whitestrips Professional Effects")} twice a year. They are the gold standard.</li>
                <li><strong>Daily Maintenance:</strong> Use a whitening toothpaste like ${link("Marvis Whitening Mint")} for style and substance.</li>
            </ul>

            <h3>Hygiene & Health</h3>
            <ul>
                <li><strong>Water Flosser:</strong> String floss is tedious. A ${link("Waterpik Water Flosser")} blasts out debris and massages gums to prevent recession.</li>
                <li><strong>Electric Toothbrush:</strong> You cannot scrub as effectively as a machine. Get a ${link("Sonicare ProtectiveClean")}.</li>
            </ul>
        `
    },
    {
        id: "gua-sha-sculpting",
        slug: "gua-sha-men-face-sculpting",
        title: "Gua Sha: Sculpting Bone Without Surgery",
        publishDate: "2024-04-18",
        keywords: ["gua sha men", "lymphatic drainage face", "stainless steel gua sha", "face sculpting tool", "depuffing face"],
        excerpt: "An ancient Chinese technique that actually works for modern aesthetics. Remove fluid retention and carve out your cheekbones.",
        content: `
            <h2>Ironing Out the Face</h2>
            <p>Gua Sha is a scraping technique that moves lymphatic fluid out of the face. It removes the "puffy" look that hides your bone structure.</p>

            <h3>The Tool</h3>
            <p>Don't use cheap jade that breaks. Use a ${link("Stainless Steel Gua Sha Tool")}. It is antibacterial, cold, and heavy.</p>

            <h3>The Routine (3 Minutes)</h3>
            <ol>
                <li>Apply a slip agent (like ${link("Squalane Oil")} or moisturizer). Never scrape dry skin.</li>
                <li><strong>Jawline:</strong> Scrape from the chin up to the ear.</li>
                <li><strong>Cheekbones:</strong> Scrape from the nose out to the temple.</li>
                <li><strong>Neck:</strong> Scrape <em>down</em> the neck to drain the fluid into the lymph nodes.</li>
            </ol>
            <p>Do this every morning to look 5lbs leaner in the face.</p>
        `
    },
    {
        id: "testosterone-foundation",
        slug: "boost-testosterone-naturally-supplements",
        title: "Testosterone: The Foundation of Aesthetics",
        publishDate: "2024-04-20",
        keywords: ["boost testosterone naturally", "tongkat ali", "vitamin d3", "boron testosterone", "zinc picolinate"],
        excerpt: "No amount of skincare fixes a low-T physiology. Testosterone dictates your bone density, muscle mass, and facial structure.",
        content: `
            <h2>The Hormone of Kings</h2>
            <p>Testosterone isn't just for muscle. It causes the widening of the jaw, thickening of the brow, and leaning out of the face.</p>

            <h3>The Supplement Stack</h3>
            <p>Most "boosters" are scams. These are the clinically proven micronutrients you are likely missing.</p>

            <h4>1. Zinc Picolinate</h4>
            <p>Essential for androgen production. Take 30mg of ${link("Zinc Picolinate")} daily.</p>

            <h4>2. Vitamin D3 + K2</h4>
            <p>Actually a hormone, not a vitamin. If you don't get daily sun, you are deficient. Take 5000IU of ${link("Vitamin D3 K2")}.</p>

            <h4>3. Tongkat Ali</h4>
            <p>An herb shown to lower SHBG (Sex Hormone Binding Globulin), freeing up more "Free Testosterone". Recommended: ${link("Solaray Tongkat Ali")}.</p>

            <h4>4. Boron</h4>
            <p>Trace mineral that also lowers estrogen and SHBG. Cycle ${link("Boron 6mg")} (2 weeks on, 1 week off).</p>
        `
    },
    {
        id: "hair-styling-texture",
        slug: "men-hair-styling-products-texture",
        title: "Hair Styling: Sea Salt Spray & Texture",
        publishDate: "2024-04-22",
        keywords: ["sea salt spray men", "texture powder hair", "matte clay", "messy hair look", "hair volume"],
        excerpt: "Stop using gel. Gel makes you look like a lego character. Embrace texture, volume, and the matte finish.",
        content: `
            <h2>Volume is King</h2>
            <p>Flat hair makes your face look rounder. Volume adds verticality, improving your facial height-to-width ratio.</p>

            <h3>The Texture Toolkit</h3>

            <h4>1. Sea Salt Spray (The Pre-Styler)</h4>
            <p>Apply to damp hair and blow dry. It adds grit and volume, mimicking the "beach hair" look. Try ${link("Pete & Pedro Sea Salt Spray")}.</p>

            <h4>2. Texture Powder (The Root Lift)</h4>
            <p>Sprinkle this white dust into your roots for instant, gravity-defying lift. Essential for fringe styles. ${link("Slick Gorilla Hair Styling Powder")} is the industry standard.</p>

            <h4>3. Matte Clay (The Hold)</h4>
            <p>Finish with a clay, not a pomade. Clays have a matte finish (no shine) and high hold. ${link("Hanz de Fuko Claymation")} or ${link("Layrite Cement Clay")} are top tier.</p>
        `
    },
    {
        id: "body-dysmorphia-check",
        slug: "looksmaxxing-mental-health",
        title: "The Dark Side: Body Dysmorphia and Mental Health in Aesthetics",
        publishDate: "2024-03-28",
        keywords: ["body dysmorphia", "BDD", "looksmaxxing toxicity", "mental health", "self improvement mindset"],
        excerpt: "Improvement is healthy. Obsession is not. How to maintain a King's mindset without falling into dysmorphia.",
        content: `
            <h2>The King's Mindset</h2>
            <p>Looksmaxxing is about maximizing your potential, not hating your existence. Body Dysmorphic Disorder (BDD) is real in this community.</p>

            <h3>Signs of Toxicity</h3>
            <ul>
                <li>Checking mirrors for 3+ hours a day.</li>
                <li>Avoiding social events because you feel "sub 5".</li>
                <li>Believing "it's over" because of one minor flaw (e.g., negative canthal tilt).</li>
            </ul>

            <h3>The Reality Check</h3>
            <p>No one inspects your face as closely as you do. Most people see the aggregate—your vibe, your grooming, your fitness, and your confidence. A 1mm asymmetry is invisible to the world.</p>

            <p><strong>Action Step:</strong> Focus on what you can change (gym, skin, grooming) and accept what you cannot (height, skull shape). The goal is to be <em>your</em> best, not <em>the</em> best. Read ${link("The Body Keeps the Score")} to understand how trauma affects your self-perception.</p>
        `
    }
];
