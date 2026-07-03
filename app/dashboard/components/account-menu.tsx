'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Cloud, CloudOff, LogOut, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/auth-provider';
import { useResumeSync } from '@/components/auth/use-resume-sync';

/**
 * Dashboard header control for cloud sync. Signed out, it invites the user to
 * sign in; signed in, it exposes a manual "Sync now", the auto-sync toggle, and
 * sign out.
 */
export default function AccountMenu() {
  const router = useRouter();
  const { user, loading, configured, signOut } = useAuth();
  const { syncing, lastSyncedAt, autoSync, setAutoSync, sync } =
    useResumeSync();

  // Don't flash the sign-in button before the session resolves.
  if (loading) return null;

  // Hide the whole control when Supabase isn't configured — nothing to sync.
  if (!configured) return null;

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push('/login')}
        className="gap-2"
      >
        <Cloud size={16} />
        Sign in to sync
      </Button>
    );
  }

  const meta = user.user_metadata ?? {};
  const name: string = meta.full_name || meta.name || user.email || 'Account';
  const avatarUrl: string | undefined = meta.avatar_url || meta.picture;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void sync()}
        disabled={syncing}
        className="gap-2 text-muted-foreground"
      >
        <RefreshCw size={15} className={syncing ? 'animate-spin' : undefined} />
        <span className="hidden sm:inline">
          {syncing ? 'Syncing…' : 'Sync now'}
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate font-medium">{name}</span>
            {user.email && (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-1.5">
            <label className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                {autoSync ? (
                  <Cloud size={15} className="text-primary" />
                ) : (
                  <CloudOff size={15} className="text-muted-foreground" />
                )}
                Auto-sync
              </span>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </label>
            <p className="mt-1 pl-6 text-xs text-muted-foreground">
              {lastSyncedAt ? (
                <span className="flex items-center gap-1">
                  <Check size={12} /> Synced{' '}
                  {formatDistanceToNow(lastSyncedAt, { addSuffix: true })}
                </span>
              ) : (
                'Back up changes automatically.'
              )}
            </p>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => void sync()}
            disabled={syncing}
          >
            <RefreshCw size={14} className="mr-2" /> Sync now
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => void signOut()}>
            <LogOut size={14} className="mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
