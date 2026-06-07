import { useEffect, useState } from 'react';
import { Check, X, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { callAdminApi } from '@/lib/adminApi';

interface DeleteRequest {
  id: string;
  note_id: string;
  requested_by_email: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by_email: string | null;
  reviewed_at: string | null;
  created_at: string;
  notes: {
    id: string;
    title: string;
    file_name: string;
    file_type: string;
    uploader_name: string | null;
  } | null;
}

export default function DeleteRequestsPanel({ adminEmail, adminPassword }: { adminEmail: string; adminPassword: string }) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await callAdminApi({ action: 'list_delete_requests', adminEmail, adminPassword });
      setRequests(data || []);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to load requests', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, approve: boolean) => {
    if (approve && !confirm('Approve and permanently delete this note?')) return;
    setActingId(id);
    try {
      await callAdminApi({
        action: approve ? 'approve_delete_request' : 'reject_delete_request',
        adminEmail,
        adminPassword,
        requestId: id,
      });
      toast({ title: 'Success', description: approve ? 'Note deleted' : 'Request rejected' });
      await load();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Action failed', variant: 'destructive' });
    } finally {
      setActingId(null);
    }
  };

  const formatDate = (s: string) => new Date(s).toLocaleString();

  const pending = requests.filter(r => r.status === 'pending');
  const others = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Delete Requests</h2>
          <p className="text-muted-foreground">Approve or reject note deletion requests from managers</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{pending.length} pending</Badge>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : requests.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No delete requests</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {[...pending, ...others].map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      {r.notes?.title || '(note removed)'}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Requested by <strong>{r.requested_by_email}</strong> · {formatDate(r.created_at)}
                    </CardDescription>
                  </div>
                  <Badge variant={r.status === 'pending' ? 'secondary' : r.status === 'approved' ? 'default' : 'outline'}>
                    {r.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {r.reason && (
                  <p className="text-sm"><span className="font-medium">Reason:</span> {r.reason}</p>
                )}
                {r.reviewed_by_email && (
                  <p className="text-xs text-muted-foreground">
                    Reviewed by {r.reviewed_by_email} {r.reviewed_at ? `· ${formatDate(r.reviewed_at)}` : ''}
                  </p>
                )}
                {r.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actingId === r.id}
                      onClick={() => review(r.id, true)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve & Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actingId === r.id}
                      onClick={() => review(r.id, false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
