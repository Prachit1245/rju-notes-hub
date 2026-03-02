import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Note, Subject } from './useSupabaseData';

export const useNotesBySubjects = (subjectIds: string[]) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectIds.length) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('is_public', true)
          .in('subject_id', subjectIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subjectIds.join(',')]);

  return { notes, loading, error };
};

export const groupNotesBySubject = (notes: Note[], subjects: Subject[]) => {
  const groups: { subject: Subject; notes: Note[] }[] = [];
  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  const grouped = new Map<string, Note[]>();
  for (const note of notes) {
    const existing = grouped.get(note.subject_id) || [];
    existing.push(note);
    grouped.set(note.subject_id, existing);
  }

  for (const [subjectId, subjectNotes] of grouped) {
    const subject = subjectMap.get(subjectId);
    if (subject) {
      groups.push({ subject, notes: subjectNotes });
    }
  }

  return groups.sort((a, b) => a.subject.name.localeCompare(b.subject.name));
};
