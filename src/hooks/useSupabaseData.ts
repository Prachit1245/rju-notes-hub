import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Program {
  id: string;
  faculty_id: string;
  name: string;
  code: string;
  level: 'Undergraduate' | 'Graduate';
  total_semesters: number;
  description?: string;
}

export interface Subject {
  id: string;
  program_id: string;
  name: string;
  code: string;
  semester: number;
  credits?: number;
  description?: string;
}

export interface Note {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type: string;
  uploader_name?: string;
  uploader_email?: string;
  download_count: number;
  rating_sum: number;
  rating_count: number;
  tags?: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'exam' | 'result' | 'admission' | 'general' | 'event';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_active: boolean;
  published_at: string;
  expires_at?: string;
}

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const { data, error } = await supabase
          .from('faculties')
          .select('*')
          .order('name');

        if (error) throw error;
        setFaculties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch faculties');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  return { faculties, loading, error };
};

export const usePrograms = (facultyId?: string) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        let query = supabase.from('programs').select('*');
        
        if (facultyId) {
          query = query.eq('faculty_id', facultyId);
        }
        
        const { data, error } = await query.order('name');

        if (error) throw error;
        setPrograms((data as Program[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [facultyId]);

  return { programs, loading, error };
};

export const useSubjects = (programId?: string, semester?: number) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!programId) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('subjects')
          .select('*')
          .eq('program_id', programId);
        
        if (semester) {
          query = query.eq('semester', semester);
        }
        
        const { data, error } = await query.order('semester', { ascending: true }).order('name');

        if (error) throw error;
        setSubjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programId, semester]);

  return { subjects, loading, error };
};

export const useNotes = (subjectId?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        let query = supabase.from('notes').select('*');
        
        if (subjectId) {
          query = query.eq('subject_id', subjectId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subjectId]);

  return { notes, loading, error };
};

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setNotices((data as Notice[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return { notices, loading, error };
};