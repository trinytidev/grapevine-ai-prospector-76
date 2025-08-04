import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    title: "Active Leads",
    value: "24",
    change: "+12%",
    icon: Target,
    color: "text-primary"
  },
  {
    title: "Proposals Sent",
    value: "18",
    change: "+8%", 
    icon: TrendingUp,
    color: "text-success"
  },
  {
    title: "Potential Value",
    value: "$45,600",
    change: "+23%",
    icon: DollarSign,
    color: "text-warning"
  },
  {
    title: "Response Rate",
    value: "68%",
    change: "+5%",
    icon: Clock,
    color: "text-accent"
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-secondary shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-success">
                  {stat.change} from last week
                </p>
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