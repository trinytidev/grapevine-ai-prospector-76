-- Create forms table
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create form fields table
CREATE TABLE public.form_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio')),
  label TEXT NOT NULL,
  placeholder TEXT,
  is_required BOOLEAN DEFAULT false,
  field_order INTEGER NOT NULL,
  options JSONB, -- For select, radio, checkbox options
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create form submissions table
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forms
CREATE POLICY "Users can view their own forms" 
ON public.forms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms" 
ON public.forms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" 
ON public.forms 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" 
ON public.forms 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for form fields
CREATE POLICY "Users can view fields of their forms" 
ON public.form_fields 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_fields.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Users can create fields for their forms" 
ON public.form_fields 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_fields.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Users can update fields of their forms" 
ON public.form_fields 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_fields.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Users can delete fields of their forms" 
ON public.form_fields 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_fields.form_id 
  AND forms.user_id = auth.uid()
));

-- RLS Policies for form submissions
CREATE POLICY "Users can view submissions of their forms" 
ON public.form_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_submissions.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Anyone can submit to published forms" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_submissions.form_id 
  AND forms.is_published = true
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_forms_updated_at
BEFORE UPDATE ON public.forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();