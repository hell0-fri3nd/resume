'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplateShowcase from '@/components/landing/template-showcase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section className="min-h-screen border-b border-border flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Create Resume with ATS Templates
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Build ATS-friendly resumes and CVs using professional templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => router.push('/builder')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Build my resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-transparent"
                onClick={() => scrollToSection(featuresRef)} // React scroll
              >
                Browse More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">✓</div>
                <h3 className="text-lg font-semibold text-foreground">ATS-Optimized</h3>
                <p className="text-muted-foreground">
                  Resumes and CVs designed to pass Applicant Tracking Systems with clean formatting and proper structure.
                </p>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">✓</div>
                <h3 className="text-lg font-semibold text-foreground">Professional Templates</h3>
                <p className="text-muted-foreground">
                  Choose from curated, professionally designed templates that showcase your experience.
                </p>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">✓</div>
                <h3 className="text-lg font-semibold text-foreground">Instant Download</h3>
                <p className="text-muted-foreground">
                  Export your resume as a PDF instantly and start applying to jobs right away.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              Choose Your Template
            </h2>
            <p className="text-muted-foreground text-lg">
              Select a template and start building your resume. Switch between templates anytime.
            </p>
          </div>
          <TemplateShowcase />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to build your resume?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get started with our resume builder in just a few minutes.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/builder')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Start Building Now
          </Button>
        </div>
      </section>

    </div>
  );
}
