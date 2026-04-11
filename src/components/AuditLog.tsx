import { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { callAdminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/use-toast';

interface AuditEntry {
  id: string;
  manager_email: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  login: { label: 'Login', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  insert_note: { label: 'Upload Note', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  delete_note: { label: 'Delete Note', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  update_note: { label: 'Update Note', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  insert_subject: { label: 'Add Subject', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  add_manager: { label: 'Add Manager', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  toggle_manager: { label: 'Toggle Manager', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  delete_manager: { label: 'Delete Manager', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

function formatDetails(action: string, details: Record<string, any>): string {
  switch (action) {
    case 'insert_note': return `Uploaded "${details.noteTitle || 'Unknown'}"`;
    case 'delete_note': return `Deleted note (${details.fileName || details.noteId || ''})`;
    case 'update_note': return `Updated note ${details.noteId?.slice(0, 8) || ''} — ${JSON.stringify(details.updates || {})}`;
    case 'add_manager': return `Added ${details.newManagerEmail} as ${details.role || 'manager'}`;
    case 'toggle_manager': return `Set manager ${details.managerId?.slice(0, 8) || ''} to ${details.isActive ? 'active' : 'inactive'}`;
    case 'delete_manager': return `Removed manager ${details.managerId?.slice(0, 8) || ''}`;
    case 'login': return 'Logged in';
    default: return JSON.stringify(details);
  }
}

export default function AuditLog({ adminEmail, adminPassword }: { adminEmail: string; adminPassword: string }) {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await callAdminApi({ action: 'get_audit_logs', adminEmail, adminPassword });
      setLogs(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Activity History</CardTitle>
            <CardDescription>Track who did what and when</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading activity logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {logs.map(log => {
              const actionInfo = actionLabels[log.action] || { label: log.action, color: 'bg-muted text-muted-foreground' };
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${actionInfo.color}`}>
                        {actionInfo.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">{log.manager_email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDetails(log.action, log.details || {})}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
