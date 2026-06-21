const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qeioagapnqxuujkuzqdw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaW9hZ2FwbnF4dXVqa3V6cWR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM4NTQwNywiZXhwIjoyMDk0OTYxNDA3fQ.X5PqQpWZceZLnJQlHMNNH0E_XM19b2kHW29wt-iKPP4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, role');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  
  console.log(`Found ${data.length} profiles:`);
  data.forEach(p => {
    console.log(`- ${p.email} (Role: ${p.role}, Name: ${p.name})`);
  });
}

run().catch(console.error);
