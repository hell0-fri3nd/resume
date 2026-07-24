'use client';

import { useState, useRef, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/store/hooks';
import {
  createResume,
  createResumeFromExtract,
} from '@/store/slices/resumes-slice';
import { extractResumeFromPdfAction } from '@/lib/agents/resume-parser';
import type { TemplateType } from '@/lib/types';

export default function CreateResumeDialog() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<TemplateType>('fshape');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    if (loading) return;

    if (!pdfFile) {
      const action = dispatch(createResume({ name, template }));
      setOpen(false);
      resetForm();
      router.push(`/builder/${action.payload.id}`);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('pdf', pdfFile);
      const extracted = await extractResumeFromPdfAction(formData);
      const action = dispatch(
        createResumeFromExtract({ name, template, extracted })
      );
      setOpen(false);
      resetForm();
      toast.success('Resume imported from PDF');
      router.push(`/builder/${action.payload.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to parse PDF'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTemplate('fshape');
    setPdfFile(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={16} />
          <span className="z">Create new resume</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new resume</DialogTitle>
          <DialogDescription>
            Give your resume a name and pick a starting template. You can change
            the template anytime.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="resume-name">Resume name</Label>
            <Input
              id="resume-name"
              autoFocus
              placeholder="e.g. Software Engineer — Acme"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={template}
              onValueChange={(value: TemplateType) => setTemplate(value)}
              disabled={loading}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fshape">F-Shape</SelectItem>
                <SelectItem value="harvard">Harvard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Import from PDF (optional)</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm transition-colors ${
                loading
                  ? 'opacity-50 pointer-events-none'
                  : dragOver
                    ? 'border-primary bg-primary/5'
                    : pdfFile
                      ? 'border-green-500 bg-green-500/5'
                      : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin text-muted-foreground" />
              ) : (
                <FileUp
                  size={24}
                  className={
                    pdfFile ? 'text-green-500' : 'text-muted-foreground'
                  }
                />
              )}
              {loading ? (
                <p className="text-muted-foreground">Parsing PDF…</p>
              ) : pdfFile ? (
                <p className="font-medium text-green-600 dark:text-green-400">
                  {pdfFile.name}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Drop your PDF here, or click to browse
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-1" />
                  Parsing…
                </>
              ) : pdfFile ? (
                'Import & edit'
              ) : (
                'Create & edit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
