import { useState, useEffect } from 'react';
import { UserPlus, Trash2, ShieldCheck, ShieldOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { callAdminApi } from '@/lib/adminApi';

interface Manager {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function ManagerPanel({ adminEmail, adminPassword }: { adminEmail: string; adminPassword: string }) {
  const { toast } = useToast();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newManager, setNewManager] = useState({ email: '', name: '', password: '', role: 'manager' });

  const fetchManagers = async () => {
    try {
      const data = await callAdminApi({ action: 'list_managers', adminEmail, adminPassword });
      setManagers(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchManagers(); }, []);

  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManager.email || !newManager.name || !newManager.password) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    if (newManager.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setAdding(true);
    try {
      await callAdminApi({
        action: 'add_manager',
        adminEmail,
        adminPassword,
        managerEmail: newManager.email,
        managerName: newManager.name,
        managerPassword: newManager.password,
        managerRole: newManager.role,
      });
      toast({ title: "Success", description: "Manager added successfully" });
      setNewManager({ email: '', name: '', password: '', role: 'manager' });
      fetchManagers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const toggleManager = async (managerId: string, currentActive: boolean) => {
    try {
      await callAdminApi({
        action: 'toggle_manager',
        adminEmail,
        adminPassword,
        managerId,
        isActive: !currentActive,
      });
      setManagers(prev => prev.map(m => m.id === managerId ? { ...m, is_active: !currentActive } : m));
      toast({ title: "Success", description: `Manager ${!currentActive ? 'activated' : 'deactivated'}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteManager = async (managerId: string) => {
    if (!confirm('Are you sure you want to permanently delete this manager?')) return;
    try {
      await callAdminApi({
        action: 'delete_manager',
        adminEmail,
        adminPassword,
        managerId,
      });
      setManagers(prev => prev.filter(m => m.id !== managerId));
      toast({ title: "Success", description: "Manager deleted" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px]"><p>Loading managers...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Manager Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Add New Manager</CardTitle>
          <CardDescription>Add a new person who can upload and manage notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddManager} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newManager.name} onChange={e => setNewManager(p => ({ ...p, name: e.target.value }))} placeholder="Manager name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={newManager.email} onChange={e => setNewManager(p => ({ ...p, email: e.target.value }))} placeholder="manager@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={newManager.password} onChange={e => setNewManager(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newManager.role} onValueChange={v => setNewManager(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={adding} className="w-full">{adding ? 'Adding...' : 'Add Manager'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Manager List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> All Managers</CardTitle>
          <CardDescription>{managers.length} manager(s) registered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managers.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{m.name}</span>
                    <Badge variant={m.role === 'admin' ? 'default' : 'secondary'}>{m.role}</Badge>
                    <Badge variant={m.is_active ? 'outline' : 'destructive'}>
                      {m.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleManager(m.id, m.is_active)}>
                    {m.is_active ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteManager(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
