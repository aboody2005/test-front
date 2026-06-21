const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qeioagapnqxuujkuzqdw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaW9hZ2FwbnF4dXVqa3V6cWR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM4NTQwNywiZXhwIjoyMDk0OTYxNDA3fQ.X5PqQpWZceZLnJQlHMNNH0E_XM19b2kHW29wt-iKPP4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('reset_token, reset_token_expiry')
    .eq('email', 'student9@ptms.com')
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    process.exit(1);
  }
  
  console.log(`TOKEN:${data.reset_token}`);
  console.log(`EXPIRY:${data.reset_token_expiry}`);
}

run().catch(console.error);
