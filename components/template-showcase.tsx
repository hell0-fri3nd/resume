'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  style: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: 'fshape',
    name: 'FShape',
    description: 'Clean and modern with optimal spacing. Perfect for tech and creative roles.',
    style: 'FShape',
    preview: 'A contemporary design that emphasizes readability and clean hierarchy.',
  },
  {
    id: 'harvard',
    name: 'Harvard',
    description: 'Classic academic style. Ideal for traditional industries and executive roles.',
    style: 'Harvard',
    preview: 'Traditional format trusted by recruiters in formal business environments.',
  },
];

export default function TemplateShowcase() {
  const router = useRouter();

  const handleGetStarted = (templateId: string) => {
    router.push(`/builder?template=${templateId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow"
        >
          {/* Preview Area */}
          <div className="bg-muted p-8 min-h-96 flex flex-col items-center justify-center text-center">
            <div className="space-y-4">
              <div className="text-sm font-mono text-muted-foreground">
                {template.preview}
              </div>
              <div className="space-y-2 text-left max-w-xs">
                <div className="h-2 bg-foreground/20 rounded w-3/4" />
                <div className="h-2 bg-foreground/20 rounded w-full" />
                <div className="h-2 bg-foreground/20 rounded w-4/5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">{template.name}</h3>
              <p className="text-muted-foreground">{template.description}</p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleGetStarted(template.id)}
            >
              Use {template.name} Template
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
