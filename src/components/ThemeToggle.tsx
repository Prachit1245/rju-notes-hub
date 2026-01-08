import { Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4 text-electric-purple" />
            {isAnimating && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-electric-purple/20"
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4 text-hot-pink" />
            {isAnimating && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-hot-pink/20"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparkle effects during animation */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60) * Math.PI / 180) * 20,
                  y: Math.sin((i * 60) * Math.PI / 180) * 20,
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="absolute"
              >
                <Sparkles className={`h-2 w-2 ${isDark ? 'text-electric-purple' : 'text-hot-pink'}`} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
