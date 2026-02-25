import { pulseOrganism } from '../services/metaMonitor';

async function run() {
    console.log("--- ORGANISM HEARTBEAT START ---");
    const result = await pulseOrganism();
    console.log("RESULT:", result);
    console.log("--- ORGANISM HEARTBEAT END ---");
}

run().catch(console.error);
