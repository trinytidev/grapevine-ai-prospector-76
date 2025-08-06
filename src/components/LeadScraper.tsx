import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Globe, Clock, DollarSign, ExternalLink } from 'lucide-react';

interface ScrapingResult {
  success: boolean;
  leadsFound: number;
  leadsSaved: number;
  leads: any[];
}

export const LeadScraper = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('web development');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['upwork', 'peopleperhour']);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResults, setLastResults] = useState<ScrapingResult | null>(null);

  const platforms = [
    { id: 'upwork', name: 'Upwork', color: 'bg-green-500' },
    { id: 'peopleperhour', name: 'PeoplePerHour', color: 'bg-blue-500' },
    { id: 'fiverr', name: 'Fiverr', color: 'bg-green-600' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleScrapeLeads = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to scrape leads.",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "No platforms selected",
        description: "Please select at least one platform to scrape.",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setLastResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('scrape-leads', {
        body: {
          searchQuery,
          platforms: selectedPlatforms,
          userId: user.id
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw error;
      }

      setLastResults(data);
      
      toast({
        title: "Leads scraped successfully!",
        description: `Found ${data.leadsFound} leads, saved ${data.leadsSaved} to your database.`,
      });

    } catch (error) {
      console.error('Error scraping leads:', error);
      toast({
        variant: "destructive",
        title: "Error scraping leads",
        description: "Failed to scrape leads from selected platforms. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Automated Lead Scraper
        </CardTitle>
        <CardDescription>
          Automatically find and import leads from popular freelancing platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Query Input */}
        <div className="space-y-2">
          <label htmlFor="search-query" className="text-sm font-medium">
            Search Keywords
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search-query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., web development, react, design"
              className="pl-10"
            />
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Platforms</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <label
                  htmlFor={platform.id}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Scraping leads...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Scrape Button */}
        <Button
          onClick={handleScrapeLeads}
          disabled={isLoading || selectedPlatforms.length === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Scraping Leads...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Scrape Leads
            </>
          )}
        </Button>

        {/* Results Display */}
        {lastResults && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg">Scraping Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {lastResults.leadsFound}
                </div>
                <div className="text-sm text-muted-foreground">Leads Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {lastResults.leadsSaved}
                </div>
                <div className="text-sm text-muted-foreground">Leads Saved</div>
              </div>
            </div>
            
            {lastResults.leads && lastResults.leads.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Recent Leads Added:</h4>
                {lastResults.leads.slice(0, 3).map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-sm truncate">
                        {lead.project_title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {lead.platform}
                        </Badge>
                        <span>{lead.client_name}</span>
                      </div>
                    </div>
                    {lead.source_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(lead.source_url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
          <strong>Note:</strong> Web scraping may be subject to platform terms of service. 
          This tool is intended for personal use to help discover potential opportunities. 
          Always review and verify leads before taking action.
        </div>
      </CardContent>
    </Card>
  );
};