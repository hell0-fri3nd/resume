'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
import { createResume } from '@/store/slices/resumes-slice';
import type { TemplateType } from '@/lib/types';

export default function CreateResumeDialog() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<TemplateType>('fshape');

  const handleCreate = () => {
    const action = dispatch(createResume({ name, template }));
    // createResume's prepare callback generates the id — read it back to navigate.
    const newId = action.payload.id;
    setOpen(false);
    setName('');
    setTemplate('fshape');
    router.push(`/builder/${newId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={16} />
          Create new resume
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
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={template}
              onValueChange={(value: TemplateType) => setTemplate(value)}
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

          <DialogFooter>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create &amp; edit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
