'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

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
    name: 'F-Shape',
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
    <div className="w-full flex justify-center">
      <Carousel className="w-full max-w-5xl" opts={{ align: 'center', loop: true }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {templates.map((template) => (
            <CarouselItem key={template.id} className="pl-2 md:pl-4 basis-full md:basis-1/2">
              <Card className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow h-full">
                {/* Preview Area */}
                <div className="bg-muted p-8 min-h-96 flex flex-col items-center justify-center text-center">
  

                    {(template.id === 'fshape') && (  
                      <div className="space-y-4">
                        <div className="text-sm text-left font-mono text-muted-foreground">
                          {template.preview}
                        </div>
                        <div className="space-y-2 text-left max-w-xs">
                          <div className="h-2 bg-foreground/20 rounded w-1/4" />
                          <div className="h-2 bg-foreground/20 rounded w-full" />
                          <div className="h-2 bg-foreground/20 rounded w-3/4" />
                          <div className="h-2 bg-foreground/20 rounded w-4/5" />
                        </div>
                      </div>
                    )}

                    {template.id === 'harvard' && (
                      <div className="space-y-4">
                        <div className="text-sm text-center font-mono text-muted-foreground">
                          {template.preview}
                        </div>
                      <div className="space-y-2 max-w-xs mx-auto">
                        <div className="h-2 bg-foreground/20 rounded w-1/4 mx-auto" />
                        <div className="h-2 bg-foreground/20 rounded w-full mx-auto" />
                        <div className="h-2 bg-foreground/20 rounded w-full mx-auto" />
                        <div className="h-2 bg-foreground/20 rounded w-4/5 mx-auto" />
                      </div>
                      </div>
                    )}

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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
