import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateLeadFormProps {
  onLeadCreated: (leadData: any) => void;
  onCancel: () => void;
}

export const CreateLeadForm = ({ onLeadCreated, onCancel }: CreateLeadFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [platform, setPlatform] = useState('');
  const [client, setClient] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !platform) {
      setError('Title and platform are required');
      return;
    }

    const leadData = {
      title: title.trim(),
      description: description.trim() || null,
      budget: budget ? parseFloat(budget) : null,
      platform,
      status: 'active' as const,
      client: client.trim() || null,
      posted_date: new Date().toISOString(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      skills: skills.length > 0 ? skills : null,
      proposal_sent: false,
      proposal_content: null,
      ai_score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
    };

    onLeadCreated(leadData);

    // Reset form
    setTitle('');
    setDescription('');
    setBudget('');
    setPlatform('');
    setClient('');
    setDeadline('');
    setSkills([]);
    setNewSkill('');
    setError('');
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., React Developer for E-commerce Platform"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g., TechCorp Solutions"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project requirements, goals, and expectations..."
          className="min-h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="5000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="platform">Platform *</Label>
          <Select onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
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

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline (Optional)</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Required Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" onClick={addSkill} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Lead
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};