import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Clock } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";

export const StatsCards = () => {
  const { leads } = useLeads();
  
  const totalLeads = leads.length;
  const activeProposals = leads.filter(lead => lead.proposal_sent).length;
  const responseRate = totalLeads > 0 ? Math.round((activeProposals / totalLeads) * 100) : 0;
  const estimatedRevenue = leads.reduce((sum, lead) => sum + (lead.budget || 0), 0);

  const stats = [
    {
      title: "Active Leads",
      value: totalLeads.toString(),
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Proposals Sent",
      value: activeProposals.toString(),
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Potential Value",
      value: estimatedRevenue > 0 ? `$${(estimatedRevenue / 1000).toFixed(1)}k` : "$0",
      icon: DollarSign,
      color: "text-warning"
    },
    {
      title: "Response Rate",
      value: `${responseRate}%`,
      icon: Clock,
      color: "text-accent"
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-secondary shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-primary ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};