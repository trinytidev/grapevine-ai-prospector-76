import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadScraper } from "@/components/LeadScraper";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Welcome to GrapeGrid
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered lead generation for freelancers and agencies
          </p>
        </div>
        
        <StatsCards />
        
        <div className="mb-8">
          <LeadScraper />
        </div>
        
        <LeadsTable />
      </main>
    </div>
  );
};

export default Index;
