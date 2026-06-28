'use client';

import { Certification } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCertification as addCertificationAction,
  removeCertification as removeCertificationAction,
  selectResumeById,
  updateCertification as updateCertificationAction,
} from '@/store/slices/resumes-slice';

interface CertificationsFormProps {
  resumeId: string;
}

export default function CertificationsForm({ resumeId }: CertificationsFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const addCertification = () => {
    dispatch(addCertificationAction({ id: resumeId }));
  };

  const updateCertification = (
    itemId: string,
    field: keyof Certification,
    value: string
  ) => {
    dispatch(
      updateCertificationAction({
        id: resumeId,
        itemId,
        changes: { [field]: value },
      })
    );
  };

  const removeCertification = (itemId: string) => {
    dispatch(removeCertificationAction({ id: resumeId, itemId }));
  };

  return (
    <div className="space-y-4">

      <CardHeaderForm 
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      title='Certifications & Licenses'
      description='Add any professional certifications or licenses you hold'/>

      {resume.certifications.length > 0 && (
        <div className="space-y-4">
          {resume.certifications.map((cert) => (
            <Card key={cert.id} className="p-6 border border-border bg-card">
              <div className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <InputField 
                  label='Certification Title'
                  required
                  placeholder="React & TypeScript - The Practical Guide"
                  value={cert.title}
                  onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>

                  <InputField 
                  label='Issuer'
                  required
                  placeholder="Udemy"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField 
                  label='Issue Date'
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>

                  <InputField 
                  label='Expiry Date (if applicable)'
                  type="date"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <InputField 
                  label='Credential ID'
                  placeholder="e.g., 12345678"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>
  
                  <InputField 
                  label='Credential URL'
                  placeholder="https://udemy-certificate.s3.amazonaws.com/pdf/UC-e8176d19-1f73-488c-b2cd-60d2310125d3.pdf"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                  className="mt-2 bg-background text-foreground border-border"/>

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
