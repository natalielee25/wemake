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
  console.error('Please set it in your .env file or as an environment variable');
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL, {prepare: false});

async function checkMigration() {
  try {
    // Check if migration table exists in both 'public' and 'drizzle' schemas
    const tableExistsPublic = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '__drizzle_migrations'
      );
    `;
    
    const tableExistsDrizzle = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'drizzle' 
        AND table_name = '__drizzle_migrations'
      );
    `;
    
    let found = false;
    const migrationTag = '0009_bitter_lake';
    let migrationSchema = null;
    
    if (tableExistsDrizzle[0].exists) {
      migrationSchema = 'drizzle';
    } else if (tableExistsPublic[0].exists) {
      migrationSchema = 'public';
    }
    
    if (!migrationSchema) {
      console.log('⚠️  Migration table does not exist in either schema. No migrations have been tracked.');
      console.log('Checking if columns exist anyway...\n');
    } else {
      console.log(`✅ Migration table found in '${migrationSchema}' schema\n`);
      
      // Get the structure of the migrations table first
      const tableStructure = await client`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = ${migrationSchema}
        AND table_name = '__drizzle_migrations'
        ORDER BY ordinal_position;
      `;
      
      console.log('Migration table structure:');
      tableStructure.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });

      // List all applied migrations (Drizzle stores migration info)
      // Use unsafe to handle dynamic schema name
      const allMigrations = await client.unsafe(`
        SELECT * FROM "${migrationSchema}"."__drizzle_migrations" 
        ORDER BY created_at DESC;
      `);

      console.log('\nAll applied migrations:');
      if (allMigrations.length === 0) {
        console.log('  No migrations found in table');
      } else {
        allMigrations.forEach(m => {
          // Try different possible column names
          const hash = m.hash || m.id || m.name || JSON.stringify(m);
          console.log(`  - ${hash}`);
        });
      }

      // Check if the specific migration tag exists
      found = allMigrations.some(m => {
        const hash = m.hash || m.id || m.name || JSON.stringify(m);
        return hash.includes(migrationTag);
      });

      console.log(`\nMigration ${migrationTag}:`, found ? '✅ APPLIED' : '❌ NOT APPLIED');
    }

    // Also check if the columns exist (double verification)
    const postsUpvotesExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'posts' 
        AND column_name = 'upvotes'
      );
    `;

    const reviewsProfileIdExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'profile_id'
      );
    `;

    console.log('\nColumn verification:');
    console.log('  posts.upvotes:', postsUpvotesExists[0].exists ? '✅ EXISTS' : '❌ MISSING');
    console.log('  reviews.profile_id:', reviewsProfileIdExists[0].exists ? '✅ EXISTS' : '❌ MISSING');

    // Final verdict
    const columnsExist = postsUpvotesExists[0].exists && reviewsProfileIdExists[0].exists;
    if (columnsExist && found) {
      console.log('\n✅ Migration is fully applied');
    } else if (columnsExist && !found) {
      console.log('\n⚠️  Columns exist but migration not tracked (may have been applied manually)');
    } else {
      console.log('\n❌ Migration has NOT been applied');
    }

  } catch (error) {
    console.error('Error checking migration:', error);
  } finally {
    await client.end();
  }
}

checkMigration();
