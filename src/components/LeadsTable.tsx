import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Eye, 
  Sparkles, 
  Clock, 
  DollarSign, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle 
} from "lucide-react";
import { Lead, mockLeads } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'bg-primary text-primary-foreground';
    case 'reviewed': return 'bg-warning text-warning-foreground';
    case 'proposal_sent': return 'bg-accent text-accent-foreground';
    case 'responded': return 'bg-success text-success-foreground';
    case 'closed': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: Lead['status']) => {
  switch (status) {
    case 'new': return <AlertCircle className="w-4 h-4" />;
    case 'reviewed': return <Eye className="w-4 h-4" />;
    case 'proposal_sent': return <Clock className="w-4 h-4" />;
    case 'responded': return <CheckCircle className="w-4 h-4" />;
    case 'closed': return <XCircle className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

const getPlatformColor = (platform: Lead['platform']) => {
  switch (platform) {
    case 'Upwork': return 'bg-green-100 text-green-800';
    case 'Freelancer': return 'bg-blue-100 text-blue-800';
    case 'Fiverr': return 'bg-emerald-100 text-emerald-800';
    case 'Indeed': return 'bg-indigo-100 text-indigo-800';
    case 'LinkedIn': return 'bg-sky-100 text-sky-800';
    case 'PeoplePerHour': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPlatform = platformFilter === "all" || lead.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const generateProposal = async (lead: Lead) => {
    setIsGenerating(true);
    setGeneratedProposal("");
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const proposal = `Dear ${lead.client},

I'm excited about your "${lead.title}" project. With my extensive experience in ${lead.skills.slice(0, 3).join(', ')}, I'm confident I can deliver exceptional results.

Here's what I bring to your project:
• ${lead.skills.length}+ years of experience in relevant technologies
• Proven track record of delivering high-quality solutions
• Strong focus on ${lead.skills[0]} and modern development practices
• Clear communication and timely delivery

I understand you're looking for ${lead.description.split('.')[0].toLowerCase()}. I've successfully completed similar projects and can provide references upon request.

Budget: I'm comfortable working within your ${lead.budget} range.
Timeline: I can start immediately and deliver by your deadline.

I'd love to discuss how I can help bring your vision to life. Would you be available for a quick call this week?

Best regards,
[Your Name]`;

    setGeneratedProposal(proposal);
    setIsGenerating(false);
    
    toast({
      title: "Proposal Generated!",
      description: "AI has created a personalized proposal for this lead.",
    });
  };

  const sendProposal = (leadId: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, proposalSent: true, status: 'proposal_sent', proposalContent: generatedProposal }
        : lead
    ));
    
    toast({
      title: "Proposal Sent!",
      description: "Your proposal has been submitted successfully.",
    });
    
    setSelectedLead(null);
    setGeneratedProposal("");
  };

  return (
    <Card className="bg-gradient-secondary shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">Lead Pipeline</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="proposal_sent">Sent</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Upwork">Upwork</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="Fiverr">Fiverr</SelectItem>
                <SelectItem value="Indeed">Indeed</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="PeoplePerHour">PeoplePerHour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="p-4 border border-border rounded-lg bg-card hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-foreground">{lead.title}</h3>
                    <div className="flex items-center gap-2 ml-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(lead.platform)}`}>
                        {lead.platform}
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">{lead.aiScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">{lead.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {lead.client}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {lead.budget}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(lead.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {lead.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {lead.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{lead.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(lead.status)} flex items-center gap-1`}>
                    {getStatusIcon(lead.status)}
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{selectedLead?.title}</DialogTitle>
                      </DialogHeader>
                      
                      {selectedLead && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Client</Label>
                              <p className="text-foreground">{selectedLead.client}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Budget</Label>
                              <p className="text-foreground">{selectedLead.budget}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Platform</Label>
                              <Badge className={getPlatformColor(selectedLead.platform)}>
                                {selectedLead.platform}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">AI Compatibility Score</Label>
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-primary">{selectedLead.aiScore}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-foreground mt-1">{selectedLead.description}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Required Skills</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedLead.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-lg font-medium">AI Proposal Generator</Label>
                              {!selectedLead.proposalSent && (
                                <Button 
                                  variant="ai" 
                                  onClick={() => generateProposal(selectedLead)}
                                  disabled={isGenerating}
                                >
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  {isGenerating ? 'Generating...' : 'Generate Proposal'}
                                </Button>
                              )}
                            </div>
                            
                            {(generatedProposal || selectedLead.proposalContent) && (
                              <div className="space-y-4">
                                <Textarea
                                  value={generatedProposal || selectedLead.proposalContent || ''}
                                  onChange={(e) => setGeneratedProposal(e.target.value)}
                                  className="min-h-64"
                                  placeholder="Generated proposal will appear here..."
                                />
                                
                                {!selectedLead.proposalSent && generatedProposal && (
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ai"
                                      onClick={() => sendProposal(selectedLead.id)}
                                    >
                                      Send Proposal
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => generateProposal(selectedLead)}
                                      disabled={isGenerating}
                                    >
                                      Regenerate
                                    </Button>
                                  </div>
                                )}
                                
                                {selectedLead.proposalSent && (
                                  <Badge className="bg-success text-success-foreground">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Proposal Sent
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leads found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};