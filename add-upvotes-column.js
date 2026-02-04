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

async function addUpvotesColumn() {
  try {
    // Check if column already exists
    const columnExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'posts' 
        AND column_name = 'upvotes'
      );
    `;

    if (columnExists[0].exists) {
      console.log('✅ Column posts.upvotes already exists!');
      return;
    }

    console.log('Adding upvotes column to posts table...');
    
    // Add the column
    await client`
      ALTER TABLE "posts" ADD COLUMN "upvotes" bigint DEFAULT 0;
    `;

    console.log('✅ Successfully added posts.upvotes column!');
    
    // Verify it was added
    const verify = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'posts' 
        AND column_name = 'upvotes'
      );
    `;
    
    if (verify[0].exists) {
      console.log('✅ Verification: Column exists in database');
    } else {
      console.log('⚠️  Warning: Column may not have been added correctly');
    }

  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    if (error.code === '42701') {
      console.error('   Column already exists (duplicate column error)');
    }
  } finally {
    await client.end();
  }
}

addUpvotesColumn();
