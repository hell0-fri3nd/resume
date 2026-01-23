'use client';

import React from 'react';
import { Resume, Certification } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CertificationsFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function CertificationsForm({ resume, setResume }: CertificationsFormProps) {
  const addCertification = () => {
    const newCertification: Certification = {
      id: uuidv4(),
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    };
    setResume({
      ...resume,
      certifications: [...resume.certifications, newCertification],
    });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setResume({
      ...resume,
      certifications: resume.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    setResume({
      ...resume,
      certifications: resume.certifications.filter((cert) => cert.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Certifications & Licenses</h2>
        <p className="text-muted-foreground text-sm mb-6">Add any professional certifications or licenses you hold</p>
      </div>

      {resume.certifications.length > 0 && (
        <div className="space-y-4">
          {resume.certifications.map((cert) => (
            <Card key={cert.id} className="p-6 border border-border bg-card">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`cert-title-${cert.id}`} className="text-sm font-medium text-foreground">
                      Certification Title *
                    </Label>
                    <Input
                      id={`cert-title-${cert.id}`}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      value={cert.title}
                      onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cert-issuer-${cert.id}`} className="text-sm font-medium text-foreground">
                      Issuer *
                    </Label>
                    <Input
                      id={`cert-issuer-${cert.id}`}
                      placeholder="e.g., Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`cert-issue-${cert.id}`} className="text-sm font-medium text-foreground">
                      Issue Date
                    </Label>
                    <Input
                      id={`cert-issue-${cert.id}`}
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cert-expiry-${cert.id}`} className="text-sm font-medium text-foreground">
                      Expiry Date (Optional)
                    </Label>
                    <Input
                      id={`cert-expiry-${cert.id}`}
                      type="date"
                      value={cert.expiryDate || ''}
                      onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`cert-id-${cert.id}`} className="text-sm font-medium text-foreground">
                      Credential ID (Optional)
                    </Label>
                    <Input
                      id={`cert-id-${cert.id}`}
                      placeholder="e.g., AWS-12345678"
                      value={cert.credentialId || ''}
                      onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cert-url-${cert.id}`} className="text-sm font-medium text-foreground">
                      Credential URL (Optional)
                    </Label>
                    <Input
                      id={`cert-url-${cert.id}`}
                      placeholder="https://..."
                      value={cert.credentialUrl || ''}
                      onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                      className="mt-2 bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeCertification(cert.id)}
                    className="gap-2"
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={addCertification}
        variant="outline"
        className="w-full gap-2 border-border text-foreground hover:bg-muted bg-transparent"
      >
        <Plus size={16} />
        Add Certification
      </Button>
    </div>
  );
}
