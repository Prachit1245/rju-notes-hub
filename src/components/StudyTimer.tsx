import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X, Coffee, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TimerMode = 'study' | 'break';

export function StudyTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const STUDY_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (mode === 'study') {
        setSessions((prev) => prev + 1);
        setMode('break');
        setTimeLeft(BREAK_TIME);
        // Play notification sound
        playNotification();
      } else {
        setMode('study');
        setTimeLeft(STUDY_TIME);
        playNotification();
      }
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode]);

  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('study');
    setTimeLeft(STUDY_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'study' 
    ? ((STUDY_TIME - timeLeft) / STUDY_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 group"
        size="icon"
      >
        <Timer className="h-6 w-6 text-white group-hover:animate-pulse" />
        <span className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-ping opacity-75" />
        <span className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">⏱</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-6 z-40 w-[280px] md:w-[320px] p-4 shadow-2xl border-2 border-orange-500/20 animate-in slide-in-from-bottom-5 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {mode === 'study' ? (
            <BookOpen className="h-4 w-4 text-primary" />
          ) : (
            <Coffee className="h-4 w-4 text-green-500" />
          )}
          <span className="font-semibold text-sm">
            {mode === 'study' ? 'Study Time' : 'Break Time'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Ring */}
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-none stroke-muted stroke-[8]"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className={cn(
              "fill-none stroke-[8] transition-all duration-300",
              mode === 'study' ? 'stroke-primary' : 'stroke-green-500'
            )}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            style={{ strokeDasharray: '283', strokeDashoffset: `${283 * (1 - progress / 100)}` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-muted-foreground">
            {sessions} session{sessions !== 1 ? 's' : ''} done
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="h-10 w-10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={toggleTimer}
          className={cn(
            "h-12 w-24",
            mode === 'break' && "bg-green-500 hover:bg-green-600"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Start
            </>
          )}
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mt-3">
        Pomodoro: 25min study, 5min break
      </p>
    </Card>
  );
}
