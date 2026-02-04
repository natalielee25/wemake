import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (e) {
  // .env file doesn't exist, that's okay
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL, {prepare: false});

async function applyTriggers() {
  try {
    const triggerSqlPath = join(__dirname, 'app/sql/triggers/post-upvote-trigger.sql');
    const triggerSql = readFileSync(triggerSqlPath, 'utf-8');

    console.log('Applying post upvote triggers...\n');

    // Split by statement-breakpoint and execute each statement
    const statements = triggerSql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        await client.unsafe(statement);
        console.log('✅ Applied:', statement.split('\n')[0].substring(0, 50) + '...');
      } catch (error) {
        // Check if it's a "already exists" error
        if (error.code === '42P07' || error.message.includes('already exists')) {
          console.log('⚠️  Already exists:', statement.split('\n')[0].substring(0, 50) + '...');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Triggers applied successfully!');

  } catch (error) {
    console.error('❌ Error applying triggers:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
  } finally {
    await client.end();
  }
}

applyTriggers();
