import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, Zap } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-gradient-secondary backdrop-blur-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  GrapeGrid
                </h1>
                <p className="text-xs text-muted-foreground">AI Lead Generator</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gradient-accent text-accent-foreground">
              Pro Plan
            </Badge>
            
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button variant="glass" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};