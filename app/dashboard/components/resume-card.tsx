'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { FileText, MoreVertical, Pencil, Copy, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch } from '@/store/hooks';
import {
  deleteResume,
  duplicateResume,
  renameResume,
} from '@/store/slices/resumes-slice';
import type { Resume } from '@/lib/types';

const TEMPLATE_LABELS: Record<Resume['template'], string> = {
  fshape: 'F-Shape',
  harvard: 'Harvard',
};

export default function ResumeCard({ resume }: { resume: Resume }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draftName, setDraftName] = useState(resume.name);

  const open = () => router.push(`/builder/${resume.id}`);

  const confirmRename = () => {
    dispatch(renameResume({ id: resume.id, name: draftName }));
    setRenameOpen(false);
  };

  return (
    <>
      <Card className="group flex flex-col p-0 overflow-hidden bg-card border-border transition-colors hover:border-primary/50">
        {/* Clickable preview area */}
        <button
          onClick={open}
          className="flex h-40 items-center justify-center bg-muted/50 border-b border-border transition-colors group-hover:bg-muted"
          aria-label={`Open ${resume.name}`}
        >
          <FileText className="w-12 h-12 text-muted-foreground" />
        </button>

        <div className="flex items-start justify-between gap-2 p-4">
          <button onClick={open} className="min-w-0 flex-1 text-left">
            <h3 className="truncate font-semibold text-foreground">
              {resume.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {TEMPLATE_LABELS[resume.template]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Edited{' '}
                {formatDistanceToNow(new Date(resume.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setDraftName(resume.name);
                  setRenameOpen(true);
                }}
              >
                <Pencil size={14} className="mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch(duplicateResume(resume.id))}
              >
                <Copy size={14} className="mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={14} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              confirmRename();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="rename-input">Resume name</Label>
              <Input
                id="rename-input"
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!draftName.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resume?</DialogTitle>
            <DialogDescription>
              &quot;{resume.name}&quot; will be permanently removed. This cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch(deleteResume(resume.id));
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
