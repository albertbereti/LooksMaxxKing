
export interface GlossaryTerm {
    id: string; // Slug for URL
    term: string;
    definition: string;
    category: string;
    detailedContent: string; // HTML content
    keywords: string[];
}

export const TERMINOLOGY_DB: GlossaryTerm[] = [
    // --- CORE SLANG ---
    {
        id: "looksmaxxing",
        term: "Looksmaxxing",
        category: "Core Slang",
        definition: "The pursuit of maximizing one's physical appearance through grooming, fitness, and surgery.",
        keywords: ["what is looksmaxxing", "looksmaxing meaning", "looksmax guide"],
        detailedContent: `
            <h2>The Definition</h2>
            <p><strong>Looksmaxxing</strong> is a portmanteau of "looks" and "maximizing". It originated in online body-building and aesthetic communities as a systematic approach to increasing one's <strong>SMV</strong> (Sexual Market Value).</p>
            <p>It is divided into two main categories:</p>
            <ul>
                <li><strong>Softmaxxing:</strong> Non-invasive improvements like gym, skincare, style, and grooming.</li>
                <li><strong>Hardmaxxing:</strong> Invasive interventions such as plastic surgery, bone lengthening, and hormonal enhancement.</li>
            </ul>
        `
    },
    {
        id: "mogging",
        term: "Mog / Mogging",
        category: "Core Slang",
        definition: "To dominate another person aesthetically. Being the better-looking person in a group frame.",
        keywords: ["mogging meaning", "mogged definition", "height mog"],
        detailedContent: `
            <h2>The Psychology of Mogging</h2>
            <p>To <strong>Mog</strong> someone is to assert dominance purely through physical metrics. The term is derived from "AMOG" (Alpha Male Of Group).</p>
            <h3>Types of Mogging</h3>
            <ul>
                <li><strong>Height Mog:</strong> Standing significantly taller than someone.</li>
                <li><strong>Frame Mog:</strong> Having broader shoulders (wider clavicles) and a better V-Taper.</li>
                <li><strong>Face Mog:</strong> Having superior craniofacial development, specifically a stronger <strong>Mandible</strong> and positive <strong>Canthal Tilt</strong>.</li>
            </ul>
        `
    },
    {
        id: "chad",
        term: "Chad",
        category: "Archetypes",
        definition: "The archetypal top-tier male (top 1-5%) characterized by high testosterone facial features, height, and dominance.",
        keywords: ["what is a chad", "gigachad meaning", "chad definition"],
        detailedContent: `
            <h2>The Genetic Apex</h2>
            <p><strong>Chad</strong> is not just a meme; it is a classification of the top percentile of men in the <strong>SMV</strong> hierarchy. A Chad typically possesses:</p>
            <ul>
                <li><strong>Height:</strong> 6'2" (188cm) or above.</li>
                <li><strong>Facial Structure:</strong> High <strong>FWHR</strong>, strong <strong>Mandible</strong>, and positive <strong>Canthal Tilt</strong>.</li>
                <li><strong>Dimorphism:</strong> Extreme sexual dimorphism (features that are distinctly male).</li>
            </ul>
            <p>The term "Gigachad" refers to an exaggerated, almost unattainable version of this archetype (e.g., Ernest Khalimov).</p>
        `
    },
    {
        id: "smv",
        term: "SMV",
        category: "Core Slang",
        definition: "Sexual Market Value. A theoretical score of one's attractiveness and desirability.",
        keywords: ["sexual market value", "smv calculator", "male smv"],
        detailedContent: `
            <h2>Understanding SMV</h2>
            <p><strong>SMV</strong> dictates your success in dating. While the <strong>Bluepill</strong> suggests personality is paramount, evolutionary biology suggests SMV is primarily driven by indicators of health and genetic fitness.</p>
            <p>For men, SMV peaks later (30-38) as it includes status and resources (LMS). For women, it correlates strongly with youth and fertility cues.</p>
        `
    },
    // --- EYE AREA ---
    {
        id: "hunter-eyes",
        term: "Hunter Eyes",
        category: "Aesthetics",
        definition: "Deep-set, vertically compact eyes with positive tilt and hooded lids.",
        keywords: ["hunter eyes vs prey eyes", "how to get hunter eyes", "canthal tilt"],
        detailedContent: `
            <h2>The Apex Predator Gaze</h2>
            <p><strong>Hunter Eyes</strong> are characterized by a compact orbital bone structure. Key features include:</p>
            <ul>
                <li><strong>Positive Canthal Tilt:</strong> The lateral canthus (outer corner) is higher than the medial canthus (inner corner).</li>
                <li><strong>Hooding:</strong> A prominent brow ridge that covers the upper eyelid. Minimal <strong>Upper Eyelid Exposure</strong> (UEE) is essential.</li>
                <li><strong>Deep Set:</strong> Eyes that sit further back in the skull, providing protection during combat.</li>
            </ul>
            <p>The opposite is <strong>Prey Eyes</strong>, which feature scleral show and bulging orbits.</p>
        `
    },
    {
        id: "canthal-tilt",
        term: "Canthal Tilt",
        category: "Aesthetics",
        definition: "The angle formed by drawing a line from the inner eye corner to the outer eye corner.",
        keywords: ["positive canthal tilt", "negative canthal tilt", "eye angle"],
        detailedContent: `
            <h2>The Mathematics of the Eye</h2>
            <p><strong>Canthal Tilt</strong> is one of the most critical metrics in facial aesthetics. It subconsciously signals dominance vs. submission.</p>
            <ul>
                <li><strong>Positive Tilt:</strong> Associated with <strong>Hunter Eyes</strong> and high testosterone.</li>
                <li><strong>Neutral Tilt:</strong> Common and acceptable.</li>
                <li><strong>Negative Tilt:</strong> The outer corner droops downwards. Often creates a tired or sad appearance ("Puppy Dog Eyes").</li>
            </ul>
            <p>Correction methods include <strong>Canthoplasty</strong> (Hardmaxxing) or 'squintmaxxing' (Softmaxxing) to build the lower eyelid muscle.</p>
        `
    },
    {
        id: "upper-eyelid-exposure",
        term: "Upper Eyelid Exposure",
        category: "Aesthetics",
        definition: "The visible amount of skin between the eyelashes and the eyebrow fold.",
        keywords: ["uee", "upper eyelid exposure", "hooded eyes men"],
        detailedContent: `
            <h2>The Predator Metric</h2>
            <p><strong>Upper Eyelid Exposure</strong> (UEE) is highly dimorphic. Women generally look better with some exposure (large, open eyes). Men look dominant with little to no exposure (hooded eyes).</p>
            <p>Excessive UEE gives a "surprised" or "fearful" look. It is often caused by a lack of brow ridge projection or a high-set eyebrow bone.</p>
            <p>To reduce UEE, one can use <strong>Volufiline</strong> to thicken the eyelid fat pad or undergo brow ridge augmentation.</p>
        `
    },
    {
        id: "scleral-show",
        term: "Scleral Show",
        category: "Aesthetics",
        definition: "The visible white of the eye (sclera) beneath the iris.",
        keywords: ["scleral show", "sanpaku eyes", "tired eyes"],
        detailedContent: `
            <h2>The Look of Fatigue</h2>
            <p><strong>Scleral Show</strong> is when the lower eyelid droops enough to reveal the white part of the eye under the pupil. This is a key feature of "Prey Eyes".</p>
            <p>It signals tiredness, aging, or poor maxillary support (the bone under the eye is recessed). It is anatomically linked to <strong>Negative Canthal Tilt</strong>.</p>
            <p>Fixes include under-eye filler (Softmaxxing) or Infraorbital Rim Implants (Hardmaxxing).</p>
        `
    },
    // --- JAW & STRUCTURE ---
    {
        id: "mewing",
        term: "Mewing",
        category: "Softmaxxing",
        definition: "Correct tongue posture technique to expand the palate and improve forward growth.",
        keywords: ["how to mew", "orthotropics", "mike mew", "jawline exercises"],
        detailedContent: `
            <h2>Orthotropics Fundamentals</h2>
            <p>Invented by Dr. Mike Mew, <strong>Mewing</strong> is the practice of resting the entire tongue against the roof of the mouth (palate) rather than the floor.</p>
            <h3>Benefits</h3>
            <p>Over time, the pressure of the tongue can:</p>
            <ul>
                <li>Expand the <strong>Maxilla</strong> (upper jaw), reducing nasal congestion.</li>
                <li>Promote <strong>Forward Growth</strong> of the face.</li>
                <li>Tighten the skin under the chin, sharpening the <strong>Gonial Angle</strong>.</li>
            </ul>
        `
    },
    {
        id: "maxilla",
        term: "Maxilla",
        category: "Aesthetics",
        definition: "The upper jaw bone. The most important bone for facial aesthetics.",
        keywords: ["maxilla bone", "recessed maxilla", "beauty bone"],
        detailedContent: `
            <h2>The Beauty Bone</h2>
            <p>The <strong>Maxilla</strong> forms the midface, holds the upper teeth, and supports the eyes. If the maxilla is recessed (set back), the entire face looks flat or melted.</p>
            <p>A well-developed maxilla provides:</p>
            <ul>
                <li>Cheekbone definition (high Ogee Curve).</li>
                <li>Under-eye support (no dark circles or Scleral Show).</li>
                <li>A straight, non-hooked nose.</li>
            </ul>
            <p>It is the primary target of <strong>Mewing</strong> and <strong>LeFort</strong> surgeries.</p>
        `
    },
    {
        id: "mandible",
        term: "Mandible",
        category: "Aesthetics",
        definition: "The lower jaw bone. It dictates the strength of the chin and jawline.",
        keywords: ["mandible growth", "lower jaw", "chin projection"],
        detailedContent: `
            <h2>The Foundation</h2>
            <p>The <strong>Mandible</strong> is the moving part of the jaw. A large, square mandible is the hallmark of high testosterone.</p>
            <p>Growth of the mandible is controlled by growth hormone and testosterone during puberty. In adulthood, it can be visually improved by widening the masseter muscles (chewing) or surgically via <strong>BSSO</strong> or <strong>Genioplasty</strong>.</p>
        `
    },
    {
        id: "forward-growth",
        term: "Forward Growth",
        category: "Aesthetics",
        definition: "The degree to which the face projects horizontally rather than growing vertically.",
        keywords: ["downswung face", "forward growth vs downward growth", "mouth breathing face"],
        detailedContent: `
            <h2>Projection is Key</h2>
            <p>Attraction is 3-dimensional. <strong>Forward Growth</strong> refers to the maxilla and mandible swinging up and forward.</p>
            <p>The opposite is "Downward Growth" (Long Face Syndrome), often caused by mouth breathing. A downswung face features a recessed chin, a convex profile (bird-like), and a long midface.</p>
        `
    },
    {
        id: "fwhr",
        term: "FWHR",
        category: "Aesthetics",
        definition: "Facial Width-to-Height Ratio. A primary indicator of testosterone and dominance.",
        keywords: ["fwhr calculator", "facial width height ratio", "masculine face ratios"],
        detailedContent: `
            <h2>The Dominance Ratio</h2>
            <p><strong>FWHR</strong> is calculated by dividing the bizygomatic width (cheekbone to cheekbone) by the upper facial height (mid-brow to upper lip).</p>
            <p>A ratio of <strong>1.9 or higher</strong> is sexually dimorphic for men and correlates with perceived aggression and competence. A narrow face (low FWHR) is seen as more trustworthy but less dominant.</p>
        `
    },
    {
        id: "gonial-angle",
        term: "Gonial Angle",
        category: "Aesthetics",
        definition: "The angle of the jaw at the corner where the ramus meets the mandible body.",
        keywords: ["ideal gonial angle", "jawline angle", "square jaw"],
        detailedContent: `
            <h2>The Jawline Architect</h2>
            <p>The <strong>Gonial Angle</strong> determines how "square" a jaw looks from the side profile. The ideal male angle is typically between <strong>110° and 120°</strong>.</p>
            <p>A steep angle (>130°) results in a downward-growing, recessed face. A sharp angle, combined with a long <strong>Ramus</strong>, creates the "Gigachad" jawline.</p>
        `
    },
    {
        id: "ramus",
        term: "Ramus",
        category: "Aesthetics",
        definition: "The vertical bone of the jaw connecting the ear to the gonial angle.",
        keywords: ["long ramus", "short ramus", "jaw bone anatomy"],
        detailedContent: `
            <h2>Vertical Support</h2>
            <p>The <strong>Ramus</strong> length is crucial for facial harmony. A long ramus provides vertical height to the lower third, supporting the <strong>Gonial Angle</strong> and preventing the "melting face" look.</p>
            <p>Lengthening the ramus typically requires <strong>Hardmaxxing</strong> via custom implants or jaw surgery (BSSO).</p>
        `
    },
    // --- SURGERY ---
    {
        id: "lefort",
        term: "LeFort I/II/III",
        category: "Hardmaxxing",
        definition: "A series of osteotomy (bone cutting) surgeries to advance the midface and maxilla.",
        keywords: ["lefort 1 surgery", "lefort 3 aesthetics", "midface advancement"],
        detailedContent: `
            <h2>The Nuclear Option</h2>
            <p>The <strong>LeFort</strong> osteotomies are the most powerful surgeries for changing facial structure. They address midface deficiency.</p>
            <ul>
                <li><strong>LeFort I:</strong> Moves the upper jaw (maxilla) forward. Fixes underbites and improves lip support.</li>
                <li><strong>LeFort II:</strong> Moves the nose and maxilla together (pyramidal fracture).</li>
                <li><strong>LeFort III:</strong> Moves the entire midface, including cheekbones and orbits. Used for extreme cases of recession or syndromic patients.</li>
            </ul>
        `
    },
    {
        id: "rhinoplasty",
        term: "Rhinoplasty",
        category: "Hardmaxxing",
        definition: "Surgery to reshape the nose (Nose Job).",
        keywords: ["male rhinoplasty", "dorsal hump removal", "ideal male nose"],
        detailedContent: `
            <h2>Center of the Face</h2>
            <p><strong>Rhinoplasty</strong> can be reductive (removing a hump) or augmentative (adding projection). For men, the goal is a straight, strong dorsum and a 90-degree <strong>Nasolabial Angle</strong>.</p>
            <p>A "Ski-slope" nose is feminine. Men should maintain a strong bridge to support the brow-nose-chin line.</p>
        `
    },
    {
        id: "genioplasty",
        term: "Genioplasty",
        category: "Hardmaxxing",
        definition: "Surgery to reshape the chin, typically by cutting and sliding the chin bone forward.",
        keywords: ["sliding genioplasty", "chin implant vs genioplasty", "weak chin surgery"],
        detailedContent: `
            <h2>Chin Projection</h2>
            <p>A <strong>Sliding Genioplasty</strong> cuts the chin bone (mentum) and moves it forward. Unlike an implant, it also pulls the muscles attached to the chin forward, which can tighten the neckline and reduce a double chin.</p>
            <p>It is the gold standard for fixing a recessed chin if the jaw (Mandible) itself is in a good position.</p>
        `
    },
    {
        id: "bsso",
        term: "BSSO",
        category: "Hardmaxxing",
        definition: "Bilateral Sagittal Split Osteotomy. A surgery to move the entire lower jaw forward.",
        keywords: ["bsso surgery", "jaw advancement", "fix overbite"],
        detailedContent: `
            <h2>Jaw Advancement</h2>
            <p><strong>BSSO</strong> involves splitting the lower jaw bone on both sides and sliding it forward. It is used to correct severe overbites and significant recession.</p>
            <p>It is often performed with a <strong>LeFort I</strong> (Double Jaw Surgery) to drastically improve <strong>Forward Growth</strong> and open the airway.</p>
        `
    },
    // --- SOFTMAXXING ---
    {
        id: "minoxidil",
        term: "Minoxidil",
        category: "Softmaxxing",
        definition: "A topical medication (vasodilator) used to stimulate hair and beard growth.",
        keywords: ["minoxidil beard", "rogaine for men", "beard growth"],
        detailedContent: `
            <h2>The Growth Stimulant</h2>
            <p><strong>Minoxidil</strong> works by shortening the resting phase of hair follicles and widening blood vessels to deliver more nutrients. It is the primary tool for:</p>
            <ul>
                <li><strong>BeardMaxxing:</strong> Turning peach fuzz (vellus hairs) into terminal beard hairs.</li>
                <li><strong>Eyebrow Density:</strong> Thickening sparse brows.</li>
                <li><strong>Hair Loss:</strong> Slowing balding (best used with <strong>Finasteride</strong>).</li>
            </ul>
        `
    },
    {
        id: "finasteride",
        term: "Finasteride",
        category: "Softmaxxing",
        definition: "A prescription medication that blocks the conversion of testosterone to DHT.",
        keywords: ["finasteride side effects", "stop hair loss", "dht blocker"],
        detailedContent: `
            <h2>The Reaper Blocker</h2>
            <p>Male Pattern Baldness is caused by DHT shrinking hair follicles. <strong>Finasteride</strong> inhibits the enzyme (5-alpha-reductase) that creates DHT.</p>
            <p>It is the most effective way to keep your hair. While fear-mongering about side effects exists (Post-Finasteride Syndrome), millions use it safely to maintain their <strong>Norwood</strong> level.</p>
        `
    },
    {
        id: "nasolabial-angle",
        term: "Nasolabial Angle",
        category: "Aesthetics",
        definition: "The angle between the nose tip and the upper lip.",
        keywords: ["nose angle", "ideal nose men", "rhinoplasty aesthetics"],
        detailedContent: `
            <h2>Nose Rotation</h2>
            <p>The <strong>Nasolabial Angle</strong> defines whether a nose is upturned or downturned. For men, the ideal is 90-95 degrees. For women, it is 95-105 degrees.</p>
            <p>A very acute angle (downturned tip) is often called a "witch's nose" and can mask a good <strong>Philtrum</strong>.</p>
        `
    },
    {
        id: "philtrum",
        term: "Philtrum",
        category: "Aesthetics",
        definition: "The vertical groove between the base of the nose and the upper lip.",
        keywords: ["long philtrum", "short philtrum", "lip lift"],
        detailedContent: `
            <h2>The Midface Connector</h2>
            <p>A compact <strong>Philtrum</strong> is a sign of youth. As humans age, the philtrum lengthens and the upper lip thins.</p>
            <p>An ideal ratio is often cited as 1:2 (Philtrum length to Chin length). If the philtrum is too long, it disrupts facial harmony. The fix is a "Lip Lift" (Hardmaxxing).</p>
        `
    },
    {
        id: "bluepill",
        term: "Bluepill",
        category: "Ideology",
        definition: "The belief that personality, kindness, and effort matter more than physical attractiveness in dating.",
        keywords: ["bluepill meaning", "redpill vs bluepill", "looks don't matter"],
        detailedContent: `
            <h2>The Comforting Lie</h2>
            <p>The <strong>Bluepill</strong> represents the mainstream societal narrative: "Just be yourself," "Looks don't matter," and "Personality is key."</p>
            <p>In the <strong>Looksmaxxing</strong> community, this is viewed as a cope that prevents men from taking actionable steps to improve their <strong>SMV</strong> via gym and aesthetics.</p>
        `
    },
    {
        id: "blackpill",
        term: "Blackpill",
        category: "Ideology",
        definition: "The nihilistic belief that genetics (bone structure, height) are the sole determinants of life quality and cannot be overcome.",
        keywords: ["blackpill meaning", "incel terminology", "genetic determinism"],
        detailedContent: `
            <h2>Genetic Determinism</h2>
            <p>The <strong>Blackpill</strong> acknowledges the scientific data regarding looks (the Halo Effect) but takes a defeatist stance. It argues that if you are not born a <strong>Chad</strong>, it is "over".</p>
            <p>LooksMaxx King rejects the defeatism of the Blackpill while accepting the data, advocating for <strong>Hardmaxxing</strong> to change one's genetic destiny.</p>
        `
    },
    {
        id: "glass-skin",
        term: "Glass Skin",
        category: "Softmaxxing",
        definition: "A skin condition characterized by extreme smoothness, even tone, and a reflective 'glass-like' sheen.",
        keywords: ["how to get glass skin", "korean skincare men", "tretinoin glow"],
        detailedContent: `
            <h2>Texture Mastery</h2>
            <p><strong>Glass Skin</strong> is the ultimate goal of skincare. It requires:</p>
            <ol>
                <li><strong>Exfoliation:</strong> Using <strong>Retinoids</strong> (Tretinoin) to speed up cell turnover.</li>
                <li><strong>Hydration:</strong> Layering humectants like Snail Mucin or Hyaluronic Acid.</li>
                <li><strong>Protection:</strong> Daily SPF 50 to prevent sun damage and collagen breakdown.</li>
            </ol>
        `
    },
    {
        id: "v-taper",
        term: "V-Taper",
        category: "Physique",
        definition: "The ratio between shoulder circumference and waist circumference.",
        keywords: ["ideal male body", "shoulder to waist ratio", "dorito body"],
        detailedContent: `
            <h2>The Golden Ratio of the Body</h2>
            <p>The <strong>V-Taper</strong> is the single most attractive trait in the male physique. It signals upper body strength and low visceral fat.</p>
            <p>To maximize V-Taper, one must:</p>
            <ul>
                <li>Widen the lateral deltoids and lats (Back width).</li>
                <li>Tighten the waist by lowering body fat to 10-12%.</li>
            </ul>
        `
    },
    {
        id: "midface-ratio",
        term: "Midface Ratio",
        category: "Aesthetics",
        definition: "The ratio of the middle third of the face (eyes to mouth) relative to facial width.",
        keywords: ["long midface", "midface compactness", "horse face"],
        detailedContent: `
            <h2>Compactness is Key</h2>
            <p>A compact <strong>Midface</strong> is crucial for aesthetic appeal. A ratio of 1:1 is often considered ideal.</p>
            <p>A long midface (often caused by mouth breathing and downward growth) can create a "tired" or "horse-like" appearance. <strong>LeFort I</strong> osteotomy is the primary surgical fix.</p>
        `
    },
    {
        id: "ogee-curve",
        term: "Ogee Curve",
        category: "Aesthetics",
        definition: "The S-shaped curve of the cheekbone and cheek hollow when viewed from a 45-degree angle.",
        keywords: ["cheekbone curve", "model cheekbones", "zygomatic arch"],
        detailedContent: `
            <h2>The Line of Beauty</h2>
            <p>The <strong>Ogee Curve</strong> is a double curve formed by the convex cheekbone and the concave cheek hollow. It is a sign of youth and high bone structure.</p>
            <p>To achieve this, one needs prominent Zygomatic Arches (cheekbones) and low buccal fat (hollow cheeks). As we age, the fat pads drop, flattening this curve.</p>
        `
    },
    {
        id: "nasion",
        term: "Nasion",
        category: "Aesthetics",
        definition: "The deepest depression at the root of the nose, between the eyes.",
        keywords: ["nasion placement", "high nasion", "nose root"],
        detailedContent: `
            <h2>The Nose Root</h2>
            <p>The <strong>Nasion</strong> marks the beginning of the nose bridge. Its placement affects the perceived length of the nose.</p>
            <p>A high nasion (starting higher up between the eyebrows) creates a "Greek Nose" or strong profile, often seen in <strong>Chad</strong> archetypes. A low nasion can make the nose look button-like or weak.</p>
        `
    }
];

// Fallback for terms not fully detailed yet
const DICTIONARY_RAW = [
    { term: "It’s Over", definition: "Defeatist slang used when one believes their genetic flaws are too severe to overcome.", category: "Core Slang" },
    { term: "Cope", definition: "A psychological defense mechanism to avoid facing harsh truths about one's appearance.", category: "Core Slang" },
    { term: "Touch Grass", definition: "Instruction to go outside and disconnect from online toxicity.", category: "Core Slang" },
    { term: "Stacy", definition: "Archetype of the top-tier attractive female.", category: "Archetypes" },
    { term: "HTN", definition: "High Tier Normie. Above average but not quite a Chad.", category: "Archetypes" },
    { term: "MTN", definition: "Mid Tier Normie. Average appearance.", category: "Archetypes" },
    { term: "LTN", definition: "Low Tier Normie. Below average.", category: "Archetypes" },
    { term: "Sub5", definition: "Someone rated below 5/10 on the aesthetic scale.", category: "Archetypes" },
    { term: "Prettyboy", definition: "Aesthetic archetype relying on youth, clear skin, and hair rather than rugged masculinity.", category: "Archetypes" },
    { term: "Slayer", definition: "A man who is extremely successful with women due to looks.", category: "Archetypes" },
    { term: "Glow Up", definition: "A significant transformation in appearance, usually positive.", category: "Archetypes" },
    { term: "Redpill", definition: "Belief in evolutionary psychology and status as drivers of mating.", category: "Ideology" },
    { term: "IPD", definition: "Interpupillary Distance. Wider spacing generally indicates better health/harmony.", category: "Aesthetics" },
    { term: "Blepharoplasty", definition: "Eyelid surgery to remove excess skin/fat.", category: "Hardmaxxing" },
    { term: "Canthoplasty", definition: "Tightening the outer eye corner to improve tilt.", category: "Hardmaxxing" },
    { term: "Orbital Decompression", definition: "Moving eyes deeper into skull (dangerous).", category: "Hardmaxxing" },
    { term: "Buccal Fat Removal", definition: "Removing cheek fat for a hollow look.", category: "Hardmaxxing" },
    { term: "FUE", definition: "Follicular Unit Extraction (Hair Transplant).", category: "Hardmaxxing" },
    { term: "Implants", definition: "Synthetic additions (PEEK/Silicone) for Jaw, Chin, or Cheeks.", category: "Hardmaxxing" },
    { term: "Limb Lengthening", definition: "Breaking legs to increase height. Extreme.", category: "Hardmaxxing" },
    { term: "Gua Sha", definition: "Lymphatic drainage tool for face depuffing.", category: "Softmaxxing" },
    { term: "Derma Rolling", definition: "Microneedling for collagen/hair growth.", category: "Softmaxxing" },
    { term: "Volufiline", definition: "Extract to increase fat volume (e.g. under eyes).", category: "Softmaxxing" },
    { term: "Sluggging", definition: "Covering face in occlusive (Vaseline) overnight.", category: "Softmaxxing" },
    { term: "No-Poo", definition: "Washing hair without stripping shampoos.", category: "Softmaxxing" },
    { term: "Castor Oil", definition: "Oil for eyebrow/eyelash thickness.", category: "Softmaxxing" },
    { term: "Body Fat %", definition: "10-12% is ideal for facial definition.", category: "Physique" },
    { term: "FFMI", definition: "Fat-Free Mass Index.", category: "Physique" },
    { term: "Bulking", definition: "Eating surplus to gain muscle.", category: "Physique" },
    { term: "Cutting", definition: "Eating deficit to lose fat.", category: "Physique" },
    { term: "Natty", definition: "Natural bodybuilder (no steroids).", category: "Physique" },
    { term: "Enhanced", definition: "Using PEDs/Steroids.", category: "Physique" },
    { term: "Ottermode", definition: "Slim but ripped swimmer physique.", category: "Physique" },
    { term: "Bearmode", definition: "Big, muscular, with higher body fat.", category: "Physique" },
    { term: "Old Money", definition: "Stealth wealth aesthetic. Neutrals, no logos.", category: "Style" },
    { term: "Dark Academia", definition: "Vintage, scholarly aesthetic.", category: "Style" },
    { term: "Capsule Wardrobe", definition: "Minimal interchangeable clothing set.", category: "Style" },
    { term: "Color Analysis", definition: "Matching clothes to skin undertones (Seasons).", category: "Style" },
    { term: "BDD", definition: "Body Dysmorphic Disorder. Obsessive focus on flaws.", category: "Mental" },
    { term: "Bigorexia", definition: "Muscle Dysmorphia. Feeling too small.", category: "Mental" },
    { term: "Stoicism", definition: "Enduring hardship without complaint.", category: "Mental" },
    { term: "Gaslighting", definition: "Manipulating reality perception.", category: "Mental" },
];

// Merge expanded and raw
const RAW_MAPPED: GlossaryTerm[] = DICTIONARY_RAW.map(item => ({
    id: item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    term: item.term,
    category: item.category,
    definition: item.definition,
    keywords: [item.term.toLowerCase(), `${item.term.toLowerCase()} meaning`],
    detailedContent: `
        <h2>Definition</h2>
        <p>${item.definition}</p>
        <p>This term is a key concept in <strong>${item.category}</strong>. Understanding it is crucial for a complete looksmaxxing strategy.</p>
    `
}));

export const FULL_TERMINOLOGY = [...TERMINOLOGY_DB, ...RAW_MAPPED].sort((a, b) => a.term.localeCompare(b.term));
