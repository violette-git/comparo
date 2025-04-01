import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kxvlutmtepgxqvndnxbn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmx1dG10ZXBneHF2bmRueGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTI0NTQsImV4cCI6MjA1ODQyODQ1NH0.BluTFwQdeTDmU1PsexgMtSs96yuv2kFEt1KDzssF7PA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fetchWebsites() {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching websites:', error)
    return
  }
  return data
}

async function main() {
  console.log('Fetching websites from database...')
  const websites = await fetchWebsites()
  console.log('Websites data:')
  console.log(JSON.stringify(websites, null, 2))
}

main()
