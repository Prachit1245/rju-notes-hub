import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Stethoscope, Scale, Cpu, Briefcase, X } from 'lucide-react';
import { useFaculties } from '@/hooks/useSupabaseData';

interface FacultyPickerModalProps {
  open: boolean;
  onClose: () => void;
}

const facultyIcons: Record<string, React.ReactNode> = {
  FOM: <Briefcase className="h-8 w-8" />,
  FHSS: <Scale className="h-8 w-8" />,
  FoSTE: <Cpu className="h-8 w-8" />,
  FHS: <Stethoscope className="h-8 w-8" />,
};

const facultyColors: Record<string, string> = {
  FOM: 'from-blue-500 to-indigo-600',
  FHSS: 'from-amber-500 to-orange-600',
  FoSTE: 'from-emerald-500 to-teal-600',
  FHS: 'from-rose-500 to-pink-600',
};

const facultyBgHover: Record<string, string> = {
  FOM: 'hover:border-blue-400 hover:shadow-blue-500/20',
  FHSS: 'hover:border-amber-400 hover:shadow-amber-500/20',
  FoSTE: 'hover:border-emerald-400 hover:shadow-emerald-500/20',
  FHS: 'hover:border-rose-400 hover:shadow-rose-500/20',
};

export default function FacultyPickerModal({ open, onClose }: FacultyPickerModalProps) {
  const navigate = useNavigate();
  const { faculties, loading } = useFaculties();

  const handleSelect = (facultyId: string) => {
    onClose();
    navigate(`/notes?faculty=${facultyId}`);
  };

  const handleBrowseAll = () => {
    onClose();
    navigate('/notes');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-electric-purple via-hot-pink to-electric-purple" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="p-6 pt-8 md:p-8 md:pt-10">
                {/* Header */}
                <motion.div
                  className="text-center mb-6 md:mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, damping: 12 }}
                  >
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold">Choose Your Faculty</h2>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Select your faculty to browse relevant study notes
                  </p>
                </motion.div>

                {/* Faculty Grid */}
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="loading-spinner" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {faculties.map((faculty, index) => (
                      <motion.button
                        key={faculty.id}
                        onClick={() => handleSelect(faculty.id)}
                        className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-border/60 bg-background/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer text-left ${facultyBgHover[faculty.code] || 'hover:border-primary hover:shadow-primary/20'}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 + index * 0.08, type: 'spring', damping: 20 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${facultyColors[faculty.code] || 'from-primary to-primary-hover'} flex items-center justify-center text-white shadow-lg`}>
                          {facultyIcons[faculty.code] || <GraduationCap className="h-8 w-8" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm md:text-base leading-tight">{faculty.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{faculty.code}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Browse All */}
                <motion.div
                  className="mt-5 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleBrowseAll}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Or browse all faculties →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
