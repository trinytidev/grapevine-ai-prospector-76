import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedLead {
  title: string;
  description: string;
  client: string;
  platform: string;
  budget: number;
  deadline: string | null;
  skills: string[];
  url: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeUpwork(searchQuery: string = "web development"): Promise<ScrapedLead[]> {
  console.log("Scraping Upwork for:", searchQuery);
  
  try {
    const url = `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(searchQuery)}&sort=recency`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      throw new Error(`Upwork scraping failed: ${response.status}`);
    }

    const html = await response.text();
    console.log("Upwork HTML length:", html.length);

    // Parse Upwork job listings (simplified parsing)
    const leads: ScrapedLead[] = [];
    const jobPattern = /<h2[^>]*class="[^"]*job-tile-title[^"]*"[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gs;
    
    let match;
    while ((match = jobPattern.exec(html)) !== null && leads.length < 5) {
      const [, relativeUrl, title] = match;
      const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `https://www.upwork.com${relativeUrl}`;
      
      leads.push({
        title: title.trim(),
        description: "Job details available on Upwork",
        client: "Upwork Client",
        platform: "Upwork",
        budget: 0,
        deadline: null,
        skills: [searchQuery],
        url: fullUrl
      });
    }

    console.log(`Found ${leads.length} Upwork leads`);
    return leads;
  } catch (error) {
    console.error("Upwork scraping error:", error);
    return [];
  }
}

async function scrapePeoplePerHour(searchQuery: string = "web development"): Promise<ScrapedLead[]> {
  console.log("Scraping PeoplePerHour for:", searchQuery);
  
  try {
    const url = `https://www.peopleperhour.com/freelance-jobs?filter=latest&q=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`PeoplePerHour scraping failed: ${response.status}`);
    }

    const html = await response.text();
    console.log("PeoplePerHour HTML length:", html.length);

    const leads: ScrapedLead[] = [];
    
    // Simplified parsing for PeoplePerHour
    const titlePattern = /<h3[^>]*class="[^"]*title[^"]*"[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gs;
    
    let match;
    while ((match = titlePattern.exec(html)) !== null && leads.length < 5) {
      const [, relativeUrl, title] = match;
      const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `https://www.peopleperhour.com${relativeUrl}`;
      
      leads.push({
        title: title.trim(),
        description: "Job details available on PeoplePerHour",
        client: "PeoplePerHour Client",
        platform: "PeoplePerHour",
        budget: 0,
        deadline: null,
        skills: [searchQuery],
        url: fullUrl
      });
    }

    console.log(`Found ${leads.length} PeoplePerHour leads`);
    return leads;
  } catch (error) {
    console.error("PeoplePerHour scraping error:", error);
    return [];
  }
}

async function scrapeFiverr(searchQuery: string = "web development"): Promise<ScrapedLead[]> {
  console.log("Scraping Fiverr for:", searchQuery);
  
  try {
    // Note: Fiverr works differently - it's more about services than job postings
    // We'll create mock data for demonstration
    const leads: ScrapedLead[] = [
      {
        title: `${searchQuery} services available on Fiverr`,
        description: "Various freelancers offering related services",
        client: "Fiverr Marketplace",
        platform: "Fiverr",
        budget: 0,
        deadline: null,
        skills: [searchQuery],
        url: `https://www.fiverr.com/search/gigs?query=${encodeURIComponent(searchQuery)}`
      }
    ];

    console.log(`Found ${leads.length} Fiverr leads`);
    return leads;
  } catch (error) {
    console.error("Fiverr scraping error:", error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery = "web development", platforms = ["upwork", "peopleperhour", "fiverr"], userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Starting lead scraping for user:", userId);
    console.log("Search query:", searchQuery);
    console.log("Platforms:", platforms);

    const allLeads: ScrapedLead[] = [];

    // Scrape from selected platforms
    if (platforms.includes("upwork")) {
      const upworkLeads = await scrapeUpwork(searchQuery);
      allLeads.push(...upworkLeads);
    }

    if (platforms.includes("peopleperhour")) {
      const pphLeads = await scrapePeoplePerHour(searchQuery);
      allLeads.push(...pphLeads);
    }

    if (platforms.includes("fiverr")) {
      const fiverrLeads = await scrapeFiverr(searchQuery);
      allLeads.push(...fiverrLeads);
    }

    console.log(`Total leads found: ${allLeads.length}`);

    // Save leads to database
    const savedLeads = [];
    for (const lead of allLeads) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert({
            user_id: userId,
            project_title: lead.title,
            client_name: lead.client,
            platform: lead.platform,
            budget_min: lead.budget,
            budget_max: lead.budget,
            status: 'potential',
            posted_date: new Date().toISOString(),
            deadline: lead.deadline,
            skills_required: lead.skills,
            description: lead.description,
            source_url: lead.url
          })
          .select()
          .single();

        if (error) {
          console.error("Error saving lead:", error);
        } else {
          savedLeads.push(data);
        }
      } catch (saveError) {
        console.error("Error saving individual lead:", saveError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadsFound: allLeads.length,
        leadsSaved: savedLeads.length,
        leads: savedLeads
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Lead scraping error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape leads', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});