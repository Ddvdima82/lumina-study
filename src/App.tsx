import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Sparkles, 
  Timer, 
  Plus, 
  CheckCircle2, 
  Circle,
  Trash2,
  Send,
  User,
  Bot,
  BrainCircuit,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  GraduationCap,
  Bell,
  Lightbulb,
  Zap,
  Coffee,
  Shapes,
  Brain,
  Target,
  BookOpen,
  Share,
  X
} from 'lucide-react';

// --- PWA Install Prompt Component ---

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'other'>('other');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS) {
      setPlatform('ios');
      // Show prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      // For Android/Chrome we could save the event and show a button
      // But for now, let's keep it simple and consistent
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-6 right-6 z-50 lg:hidden"
      >
        <div className="bg-dark-card border border-sage/30 rounded-[32px] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-sage rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Установи Lumina</h3>
              <p className="text-xs text-gray-500 font-medium">Добавь на главный экран для быстрого доступа</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            {platform === 'ios' ? (
              <p className="text-sm text-gray-300 leading-relaxed">
                Нажми <Share size={16} className="inline mx-1 text-sage" /> в меню Safari и выбери <span className="text-white font-bold">«На экран "Домой"»</span>
              </p>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                Нажми на три точки в углу браузера и выбери <span className="text-white font-bold">«Установить приложение»</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import { Subject, Task, Message, View, UserProfile } from './types';
import { SUBJECT_CONFIG, MOTIVATIONAL_QUOTES, UPDATED_SCHEDULE } from './constants';
import { chatWithLumina, getSchoolTips } from './services/gemini';

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon }: any) => {
  const variants: any = {
    primary: 'bg-sage text-white hover:opacity-90',
    secondary: 'bg-white text-sage border border-sage hover:bg-paper',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- View Components ---

const DashboardView = ({ tasks, setView, schedule, profile }: { tasks: Task[], setView: (v: View) => void, schedule: any, profile: UserProfile }) => {
  const [quote, setQuote] = useState('');
  
  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Find next lesson
  const daysMap: any = { 0: 'Вс', 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб' };
  const today = daysMap[new Date().getDay()] || 'Пн';
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const todayLessons = schedule[today] || [];
  const nextLesson = todayLessons.find((l: any) => l.time > currentTime);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 md:gap-10"
    >
      <header className="col-span-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2 md:mb-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Привет, {profile.name || 'Студент'}! ✨</h1>
          <p className="text-gray-500 font-medium max-w-lg leading-relaxed text-sm md:text-base">{quote}</p>
        </div>
        <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-white">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p className="text-[10px] text-sage font-black uppercase tracking-[0.2em] mt-1">{profile.grade !== 'Не указано' ? profile.grade : 'Режим учёбы'}</p>
          </div>
          <button 
            onClick={() => setView('profile')}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage font-bold text-xl shadow-inner ml-auto md:ml-0 hover:scale-105 active:scale-95 transition-all"
          >
            {profile.name?.[0] || 'L'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1">
        <section className="card flex flex-col min-h-[400px] md:min-h-[450px]">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Домашнее задание</h2>
            <button onClick={() => setView('planner')} className="text-sage font-bold text-sm tracking-wide hover:text-white transition-colors border-b border-sage/30 hover:border-white transition-all pb-0.5">Смотреть всё</button>
          </div>
          <div className="flex-1 space-y-2">
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 md:gap-5 py-4 md:py-5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors rounded-2xl px-2 md:px-4 -mx-2 md:-mx-4 group">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${SUBJECT_CONFIG[task.subject]?.color || 'bg-white/5 text-gray-400'} bg-opacity-10 shadow-sm border border-white/[0.03]`}>
                  {SUBJECT_CONFIG[task.subject] ? React.createElement(SUBJECT_CONFIG[task.subject].icon, { size: 20 }) : <Circle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white tracking-tight mb-0.5 md:mb-1 truncate text-sm md:text-base">{task.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest ${SUBJECT_CONFIG[task.subject]?.color || 'bg-white/5 text-gray-400'} bg-opacity-10 text-opacity-80`}>
                      {task.subject}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs font-black text-gray-600 shrink-0 uppercase tracking-widest group-hover:text-gray-400 transition-colors">до {task.dueDate?.split('-')[2] || '??'}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-40">
                <Award size={48} className="text-sage mb-4 md:size-16" />
                <p className="text-white font-bold max-w-xs text-base md:text-lg">Все задачи выполнены! 🎓</p>
              </div>
            )}
          </div>
        </section>

        <section className="card flex flex-col items-center justify-center text-center py-8 md:py-12 bg-dark-card/30 border-white/5">
           <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-8">Следующий урок</h2>
           {nextLesson ? (
             <div className="space-y-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-sage/10 text-sage flex items-center justify-center mx-auto shadow-2xl shadow-sage/5 border border-sage/20">
                    <GraduationCap size={44} />
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-mono font-bold text-white tracking-tighter">{nextLesson.time}</p>
                    <h3 className="text-2xl font-bold text-sage tracking-tight">{nextLesson.subject}</h3>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">Кабинет {nextLesson.room}</p>
                </div>
                <button onClick={() => setView('schedule')} className="px-6 py-2.5 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Открыть расписание</button>
             </div>
           ) : (
             <div className="opacity-40 space-y-4">
                <Coffee size={48} className="mx-auto text-gray-500" />
                <p className="text-white font-bold">На сегодня уроков больше нет!</p>
             </div>
           )}
        </section>
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        <section className="card flex flex-col items-center justify-center text-center py-8 md:py-12">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-6 md:mb-10">Прогресс дня</h3>
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center bg-white/[0.02] shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)] border border-white/5">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="50%" cy="50%" r="45%"
                className="fill-none stroke-white/5 stroke-[8] md:stroke-[10]"
              />
              <circle
                cx="50%" cy="50%" r="45%"
                className="fill-none stroke-sage stroke-[8] md:stroke-[10] transition-all duration-1000 ease-out"
                strokeDasharray="283%"
                strokeDashoffset={`${2.83 * (100 - progressPercent)}%`}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">{progressPercent}%</span>
                <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Готово</span>
            </div>
          </div>
          <p className="mt-8 md:mt-10 font-bold text-gray-200 tracking-tight text-base md:text-lg">{progressPercent === 100 ? 'Невероятно! 🎉' : 'Почти у цели!'}</p>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 md:mt-2">{completedCount} из {totalTasks} заданий выполнено</p>
        </section>

        <section className="card bg-sage/5 border-sage/10 p-6 md:p-10">
          <h3 className="font-bold text-white mb-4 md:mb-6 text-lg md:text-xl tracking-tight flex items-center gap-3">
            <Sparkles size={20} className="text-sage" /> Lumina
          </h3>
          <div className="glass-panel p-4 md:p-5 mb-5 md:mb-6 shadow-lg">
            <p className="text-[9px] text-sage font-black uppercase tracking-widest mb-2 md:mb-2.5">Совет от ИИ</p>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">"Готова взяться за {upcomingTasks[0]?.subject || 'учёбу'}? Я могу помочь!"</p>
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <button onClick={() => setView('tutor')} className="w-full py-3 md:py-4 bg-sage text-white text-xs md:text-sm font-bold rounded-xl md:rounded-2xl shadow-xl shadow-sage/20 hover:scale-[1.02] active:scale-95 transition-all">Открыть чат</button>
            <button onClick={() => setView('planner')} className="w-full py-2.5 md:py-3.5 text-gray-500 text-[10px] md:text-xs font-bold rounded-xl md:rounded-2xl hover:text-gray-300 transition-colors">Позже</button>
          </div>
        </section>
      </div>

      <section className="glass-panel col-span-full flex flex-col xl:flex-row justify-between items-center gap-6 md:gap-8 p-8 md:p-12 bg-sage/10 border-sage/20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center w-full xl:w-auto">
            <div className="flex flex-col text-center md:text-left">
                <span className="text-[10px] text-sage font-black tracking-[0.2em] mb-2 uppercase">Таймер фокуса</span>
                <span className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">25:00</span>
            </div>
            <div className="hidden md:block w-px h-12 md:h-16 bg-white/10"></div>
            <button 
              onClick={() => setView('focus')}
              className="group flex items-center gap-4 md:gap-5 px-6 md:px-8 py-3 md:py-4 bg-white/5 hover:bg-white/10 text-white rounded-[20px] md:rounded-[24px] transition-all border border-white/5 w-full md:w-auto justify-center md:justify-start"
            >
                <div className="p-2 md:p-3 bg-sage rounded-xl md:rounded-2xl shadow-lg ring-4 ring-sage/10 transition-transform group-hover:scale-110"><Plus size={20} /></div>
                <div className="text-left">
                    <p className="font-bold tracking-tight text-base md:text-lg">Начать сессию</p>
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider uppercase">Метод Помодоро</p>
                </div>
            </button>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
            <div className="text-right hidden sm:block">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Активное сообщество</p>
                <p className="text-xs text-sage font-bold tracking-tight">32 пользователя в эфире</p>
            </div>
            <div className="flex -space-x-3 md:-space-x-4">
                {['J', 'S', 'A', '+2'].map((init, i) => (
                    <div key={i} className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl border-2 md:border-4 border-[#121212] flex items-center justify-center text-[10px] md:text-[11px] font-black ${i === 3 ? 'bg-dark-accent text-gray-500' : 'bg-sage text-white shadow-xl'}`}>{init}</div>
                ))}
            </div>
        </div>
      </section>
    </motion.div>
  );
};

const PlannerView = ({ tasks, setTasks, onAskHelp }: { tasks: Task[], setTasks: (t: Task[]) => void, onAskHelp: (task: Task) => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subject: Subject.ALGEBRA, dueDate: '', reminderTime: '', notes: '' });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', subject: Subject.ALGEBRA, dueDate: '', reminderTime: '', notes: '' });
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Планировщик</h1>
          <p className="text-gray-500 mt-3 font-medium text-lg leading-relaxed">Систематизируй свои учебные цели. 📐</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${isAdding ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-sage text-white shadow-sage/20'}`}
        >
          {isAdding ? 'Отмена' : <><Plus size={18} /> Добавить</>}
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card bg-sage/5 border-sage/20 p-6 md:p-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="task-title" className="text-[10px] font-black text-sage uppercase tracking-[0.2em] ml-1">Что нужно сделать?</label>
                <input 
                   id="task-title"
                   type="text" 
                   placeholder="Напр. Подготовиться к тесту"
                   className="w-full px-5 py-3 md:py-4 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all font-medium text-white placeholder:text-gray-700"
                   value={newTask.title}
                   onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="task-subject" className="text-[10px] font-black text-sage uppercase tracking-[0.2em] ml-1">Предмет</label>
                <select 
                   id="task-subject"
                   className="w-full px-5 py-3 md:py-4 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage transition-all font-bold appearance-none text-white [&>option]:bg-dark-card"
                   value={newTask.subject}
                   onChange={e => setNewTask({...newTask, subject: e.target.value as Subject})}
                >
                  {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="task-due" className="text-[10px] font-black text-sage uppercase tracking-[0.2em] ml-1">Срок исполнения</label>
                <input 
                   id="task-due"
                   type="date" 
                   className="w-full px-5 py-3 md:py-4 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage transition-all font-bold text-white [color-scheme:dark]"
                   value={newTask.dueDate}
                   onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="task-reminder" className="text-[10px] font-black text-sage uppercase tracking-[0.2em] ml-1">Напоминание (время)</label>
                <input 
                   id="task-reminder"
                   type="time" 
                   className="w-full px-5 py-3 md:py-4 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage transition-all font-bold text-white [color-scheme:dark]"
                   value={newTask.reminderTime}
                   onChange={e => setNewTask({...newTask, reminderTime: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={addTask} 
                  className="w-full py-4 bg-sage text-white font-black uppercase text-xs tracking-[0.15em] rounded-2xl shadow-xl shadow-sage/20 hover:opacity-90 transition-all"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
<section className="card p-6 md:p-8 bg-sage/5 border-sage/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left min-w-[120px]">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Прогресс</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{progressPercent}%</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Готово</span>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl">
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-sage shadow-[0_0_20px_rgba(152,251,152,0.2)]"
              />
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="text-sage">{completedCount} завершено</span>
              <span className="text-gray-600">{totalCount - completedCount} ожидает</span>
            </div>
          </div>
        </div>
      </section>

      <Reorder.Group 
        axis="y" 
        values={tasks} 
        onReorder={setTasks}
        className="space-y-3 md:space-y-4"
      >
        {tasks.length > 0 ? tasks.map(task => (
          <Reorder.Item 
            value={task}
            key={task.id} 
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 md:p-6 rounded-[24px] sm:rounded-[32px] transition-all border cursor-grab active:cursor-grabbing ${task.completed ? 'bg-transparent border-white/5 opacity-40' : 'bg-dark-card border-white/5 hover:border-sage/20 hover:shadow-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]'}`}
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }} 
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-sage border-sage text-white' : 'border-white/10 text-transparent hover:border-sage/50'}`}
                  aria-label={task.completed ? "Отметить как невыполненное" : "Отметить как выполненное"}
                  aria-pressed={task.completed}
              >
                <CheckCircle2 size={18} />
              </button>
              <div className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl shrink-0 border border-white/[0.03] ${SUBJECT_CONFIG[task.subject]?.color || 'bg-white/5 text-gray-500'} bg-opacity-10`} aria-hidden="true">
                {SUBJECT_CONFIG[task.subject] ? React.createElement(SUBJECT_CONFIG[task.subject].icon, { size: 20 }) : <Circle size={20} />}
              </div>
              <div className="flex-1 min-w-0 sm:hidden">
                <h4 className={`font-bold text-white truncate tracking-tight text-base sm:text-xl ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
              </div>
            </div>
            
            <div className="flex-1 min-w-0 hidden sm:block">
              <h4 className={`font-bold text-white truncate tracking-tight text-lg md:text-xl ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
              <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-gray-500 tracking-tight">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sage">{task.subject}</span>
                <div className="w-1.5 h-1.5 bg-white/10 rounded-full" aria-hidden="true"></div>
                <span>Срок: {task.dueDate?.split('-')[2] || '??'} мая</span>
                {task.reminderTime && (
                  <>
                    <div className="w-1.5 h-1.5 bg-white/10 rounded-full" aria-hidden="true"></div>
                    <span className="flex items-center gap-1.5 text-sage">
                      <Bell size={12} />
                      {task.reminderTime}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0">
               <div className="flex-1 sm:hidden">
                 <p className="text-[9px] font-black text-sage uppercase tracking-widest">{task.subject}</p>
                 <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-[10px] text-gray-500">{task.dueDate?.split('-')[2] || '??'} мая</p>
                   {task.reminderTime && (
                     <p className="text-[10px] text-sage font-bold flex items-center gap-1">
                       <Bell size={10} />
                       {task.reminderTime}
                     </p>
                   )}
                 </div>
               </div>
              {!task.completed && (
                <button 
                  onClick={() => onAskHelp(task)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-sage hover:bg-sage/10 rounded-xl md:rounded-2xl transition-all"
                  title="Помощь ИИ"
                  aria-label={`Получить помощь ИИ для задания: ${task.title}`}
                >
                  <Sparkles size={20} />
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }} 
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl md:rounded-2xl transition-all"
                aria-label={`Удалить задание: ${task.title}`}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </Reorder.Item>
        )) : (
          <div className="card text-center py-24 md:py-32 bg-transparent border-dashed border-2 border-white/5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700 mb-6 border border-white/5 shadow-inner">
               <Shapes size={40} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-600 tracking-tight">Пока здесь пусто.</h3>
            <p className="text-gray-700 font-medium mt-3 text-base md:text-lg max-w-xs mx-auto">Начни планировать свои успехи прямо сейчас! ✨</p>
          </div>
        )}
      </Reorder.Group>
    </motion.div>
  );
};

const TutorView = ({ initialTask }: { initialTask?: Task | null }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMsg = initialTask 
      ? `Привет! Вижу, тебе нужна помощь с заданием «${initialTask.title}» по предмету ${initialTask.subject}. 

Я могу помочь составить план выполнения, объяснить теорию или просто подсказать, с чего начать. Что именно вызывает трудности?`
      : "Привет! Я Lumina, твой помощник в учебе. ✨ Над чем поработаем сегодня? Я могу объяснить сложные моменты, кратко пересказать конспекты или дать подсказки к домашке!";

    setMessages([
      { id: 'welcome', role: 'model', content: welcomeMsg, timestamp: Date.now() }
    ]);
    
    if (initialTask) {
      setInput(`Расскажи подробнее, как мне лучше выполнить задание: "${initialTask.title}"?`);
    } else {
      setInput('');
    }
  }, [initialTask]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideContent?: string) => {
    const content = overrideContent || input;
    if (!content.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: content, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await chatWithLumina([...messages, userMsg]);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: response, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-160px)]"
    >
      <header className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-[22px] bg-sage flex items-center justify-center text-white shadow-2xl shadow-sage/30 rotate-3 transition-transform hover:rotate-0">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Помощник Lumina</h1>
          <div className="flex items-center gap-3 mt-1.5">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-sage uppercase tracking-[0.25em]">Система активна</p>
          </div>
        </div>
      </header>

      <div className="flex-1 card p-0 flex flex-col overflow-hidden bg-[#0d0f11] border-white/5 border-2">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-xl ${msg.role === 'user' ? 'bg-sage text-white' : 'bg-white/5 text-sage border border-white/5'}`}>
                {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
              </div>
              <div className={`max-w-[80%] p-6 rounded-[32px] ${msg.role === 'user' ? 'bg-sage text-white rounded-tr-none shadow-lg shadow-sage/10' : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'}`}>
                 <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                 <span className="block text-[9px] mt-4 opacity-40 font-black uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-[18px] bg-white/5 text-sage flex items-center justify-center border border-white/5">
                <Bot size={22} />
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] rounded-tl-none flex gap-2 items-center">
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-sage rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-dark-card border-t border-white/5">
          <div className="relative max-w-4xl mx-auto group">
            <textarea 
              rows={1}
              placeholder="Спроси меня о чём угодно..."
              className="w-full pl-8 pr-20 py-5 rounded-[24px] border border-white/5 outline-none focus:ring-4 focus:ring-sage/10 transition-all resize-none shadow-2xl bg-white/[0.02] font-medium text-white placeholder:text-gray-600"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-sage text-white flex items-center justify-center hover:scale-105 disabled:bg-gray-800 disabled:text-gray-600 disabled:scale-100 transition-all shadow-xl active:scale-95"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FocusTimerView = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = (newMode: 'study' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (mode === 'study' ? 25 * 60 : 5 * 60);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[75vh] gap-16"
    >
      <div className="flex p-2 bg-white/[0.02] rounded-[28px] border border-white/5 shadow-2xl">
        <button 
          onClick={() => toggleMode('study')}
          className={`px-12 py-4 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all ${mode === 'study' ? 'bg-sage text-white shadow-xl shadow-sage/20' : 'text-gray-600 hover:text-gray-400'}`}
        >
          Фокус
        </button>
        <button 
          onClick={() => toggleMode('break')}
          className={`px-12 py-4 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all ${mode === 'break' ? 'bg-sage text-white shadow-xl shadow-sage/20' : 'text-gray-600 hover:text-gray-400'}`}
        >
          Отдых
        </button>
      </div>

      <div className="relative group">
          <div className="absolute inset-0 bg-sage/5 rounded-full blur-[60px] group-hover:bg-sage/10 transition-colors"></div>
          <svg className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] -rotate-90 relative z-10 transition-all">
             <circle cx="50%" cy="50%" r="45%" className="fill-transparent stroke-white/5 stroke-[12] sm:stroke-[16]" />
             <circle 
                cx="50%" cy="50%" r="45%" 
                className={`fill-none stroke-[12] sm:stroke-[16] transition-all duration-300 ease-linear ${mode === 'study' ? 'stroke-sage' : 'stroke-emerald-400'}`}
                strokeDasharray="283%"
                strokeDashoffset={`${2.83 * (100 - progress * 100)}%`}
                strokeLinecap="round"
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <h2 className="text-[70px] sm:text-[100px] font-mono font-bold text-white tracking-tighter leading-none">{formatTime(timeLeft)}</h2>
            <div className="flex items-center gap-3 mt-4 sm:mt-6">
                 <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-sage animate-pulse' : 'bg-gray-600'}`}></div>
                 <p className="text-[9px] sm:text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">{mode === 'study' ? 'Идет работа' : 'Время отдыха'}</p>
            </div>
          </div>
      </div>

      <div className="flex gap-8 items-center relative z-10">
        <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-16 py-6 rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${isActive ? 'bg-white/5 border-2 border-sage/50 text-sage' : 'bg-sage text-white shadow-sage/30 hover:scale-105'}`}
        >
          {isActive ? 'Пауза' : 'Начать'}
        </button>
        <button 
            onClick={resetTimer}
            className="w-20 h-20 rounded-[32px] bg-white/[0.02] text-gray-600 flex items-center justify-center hover:bg-white/5 hover:text-gray-300 transition-all border border-white/5"
        >
          <Clock size={32} />
        </button>
      </div>

      <div className="max-w-md p-6 glass-panel text-center">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">
           Сессия 4 из 8 • Сегодня ты в ударе! ⚡️
        </p>
      </div>
    </motion.div>
  );
};

const ScheduleView = ({ schedule, setSchedule }: { schedule: any, setSchedule: (s: any) => void }) => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
  const [activeDay, setActiveDay] = useState('Пн');
  const [isEditing, setIsEditing] = useState(false);
  const [newEntry, setNewEntry] = useState({ time: '', subject: '', room: '' });

  const addLesson = () => {
    if (!newEntry.time || !newEntry.subject) return;
    const updatedDay = [...(schedule[activeDay] || []), newEntry].sort((a, b) => a.time.localeCompare(b.time));
    setSchedule({ ...schedule, [activeDay]: updatedDay });
    setNewEntry({ time: '', subject: '', room: '' });
    setIsEditing(false);
  };

  const removeLesson = (index: number) => {
    const updatedDay = (schedule[activeDay] || []).filter((_: any, i: number) => i !== index);
    setSchedule({ ...schedule, [activeDay]: updatedDay });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Расписание</h1>
          <p className="text-gray-500 mt-3 font-medium text-lg leading-relaxed">Твой академический маршрут. 📚</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${isEditing ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-sage text-white shadow-sage/20'}`}
        >
          {isEditing ? 'Отмена' : <><Plus size={18} /> Добавить урок</>}
        </button>
      </header>

      <div className="flex p-2 bg-white/[0.02] rounded-[28px] border border-white/5 overflow-x-auto no-scrollbar">
        {days.map(day => (
          <button 
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 min-w-[80px] px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all ${activeDay === day ? 'bg-sage text-white shadow-xl shadow-sage/20' : 'text-gray-600 hover:text-gray-400'}`}
          >
            {day}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card bg-sage/5 border-sage/20 p-6 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage uppercase tracking-[0.2em]">Время</label>
                <input 
                  type="time" 
                  className="w-full px-5 py-3 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage text-white [color-scheme:dark]"
                  value={newEntry.time}
                  onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage uppercase tracking-[0.2em]">Предмет</label>
                <input 
                  type="text" 
                  placeholder="Напр. Биология"
                  className="w-full px-5 py-3 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage text-white"
                  value={newEntry.subject}
                  onChange={e => setNewEntry({ ...newEntry, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage uppercase tracking-[0.2em]">Кабинет</label>
                <input 
                  type="text" 
                  placeholder="Напр. 204"
                  className="w-full px-5 py-3 bg-dark-bg/50 rounded-2xl border border-white/5 outline-none focus:border-sage text-white"
                  value={newEntry.room}
                  onChange={e => setNewEntry({ ...newEntry, room: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={addLesson} 
                  className="w-full py-3 bg-sage text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-sage/20"
                >
                  Добавить
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {(schedule[activeDay] || []).length > 0 ? (schedule[activeDay] || []).map((entry: any, i: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={i} 
            className="flex items-center gap-8 p-8 rounded-[36px] bg-dark-card border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-sage/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-sage opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex flex-col items-center justify-center min-w-[100px] py-2 border-r border-white/5">
              <span className="text-2xl font-mono font-bold text-white tracking-tight">{entry.time}</span>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-2">Урок {i + 1}</span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white tracking-tight group-hover:text-sage transition-colors">{entry.subject}</h4>
              <div className="flex items-center gap-6 mt-3">
                 <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Room</span>
                     <span className="text-sm font-bold">{entry.room}</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => removeLesson(i)}
              className="w-14 h-14 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
              aria-label="Удалить урок"
            >
               <Trash2 size={24} />
            </button>
          </motion.div>
        )) : (
          <div className="card text-center py-20 bg-transparent border-dashed border-2 border-white/5 flex flex-col items-center opacity-60">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700 mb-5 border border-white/5">
               <Coffee size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-600">На {activeDay === 'Ср' || activeDay === 'Пт' ? 'эту' : 'этот'} {activeDay === 'Вт' || activeDay === 'Чт' ? 'день' : activeDay === 'Пн' ? 'день' : 'день'} расписания пока нет</h3>
            <p className="text-gray-700 text-sm mt-2">Добавь свои уроки, чтобы не пропустить важное!</p>
          </div>
        )}
      </div>

      <div className="p-10 glass-panel text-center">
         <p className="text-sm font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed italic">
            «Никогда не переставай учиться, потому что жизнь никогда не перестает учить».
         </p>
      </div>
    </motion.div>
  );
};

const ProfileView = ({ profile, setProfile }: { profile: UserProfile, setProfile: (p: UserProfile) => void }) => {
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      setProfile({ ...profile, goals: [...profile.goals, newGoal.trim()] });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const updatedGoals = profile.goals.filter((_, i) => i !== index);
    setProfile({ ...profile, goals: updatedGoals });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header>
        <h1 className="text-5xl font-bold text-white tracking-tight">Мой профиль</h1>
        <p className="text-gray-500 mt-3 font-medium text-lg leading-relaxed">Настрой Lumina под свой учебный темп. ✨</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="card p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[32px] bg-sage/10 text-sage flex items-center justify-center border border-sage/20 text-3xl font-black">
              {profile.name?.[0] || 'L'}
            </div>
            <div>
               <p className="text-[10px] font-black text-sage uppercase tracking-[0.2em] mb-1">Студент</p>
               <h2 className="text-2xl font-bold text-white">{profile.name || 'Анонимный исследователь'}</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Твоё имя</label>
              <input 
                 type="text" 
                 className="w-full px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5 outline-none focus:border-sage text-white font-bold"
                 value={profile.name}
                 onChange={e => setProfile({...profile, name: e.target.value})}
                 placeholder="Как тебя зовут?"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Класс / Курс</label>
              <input 
                 type="text" 
                 className="w-full px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5 outline-none focus:border-sage text-white font-bold"
                 value={profile.grade}
                 onChange={e => setProfile({...profile, grade: e.target.value})}
                 placeholder="Напр. 11 класс или 2 курс"
              />
            </div>
          </div>
        </section>

        <section className="card p-8 md:p-10 space-y-8">
           <div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">Цели обучения</h3>
              <p className="text-sm text-gray-500">Что ты хочешь достичь в этом семестре?</p>
           </div>

           <div className="space-y-4">
              <div className="flex gap-3">
                 <input 
                    type="text" 
                    className="flex-1 px-5 py-3.5 bg-white/[0.02] rounded-2xl border border-white/5 outline-none focus:border-sage text-white text-sm"
                    placeholder="Напр. Сдать ЕГЭ по математике на 90+"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addGoal()}
                 />
                 <button 
                    onClick={addGoal}
                    className="w-14 h-14 bg-sage text-white rounded-2xl flex items-center justify-center shadow-xl shadow-sage/20 hover:scale-105 active:scale-95 transition-all"
                 >
                    <Plus size={24} />
                 </button>
              </div>

              <div className="space-y-3">
                 {profile.goals.map((goal, i) => (
                    <motion.div 
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       key={i} 
                       className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 group"
                    >
                       <span className="text-sm text-gray-200 font-medium">{goal}</span>
                       <button 
                          onClick={() => removeGoal(i)}
                          className="text-gray-700 hover:text-rose-500 p-2 transition-colors"
                       >
                          <Trash2 size={18} />
                       </button>
                    </motion.div>
                 ))}
                 {profile.goals.length === 0 && (
                   <p className="text-center py-6 text-gray-600 italic text-sm">У тебя пока нет поставленных целей.</p>
                 )}
              </div>
           </div>
        </section>
      </div>
    </motion.div>
  );
};

const TipsView = ({ setView }: { setView: (v: View) => void }) => {
  const [tips, setTips] = useState<any[]>(() => {
    const saved = localStorage.getItem('lumina_dynamic_tips');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const fetchNewTips = async () => {
    setLoading(true);
    const newTips = await getSchoolTips();
    if (newTips && newTips.length > 0) {
      setTips(newTips);
      localStorage.setItem('lumina_dynamic_tips', JSON.stringify(newTips));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tips.length === 0) {
      fetchNewTips();
    }
  }, []);

  const getIcon = (iconName: string) => {
    const icons: any = {
      Zap, BrainCircuit, Shapes, Coffee, Lightbulb, TrendingUp, Brain, Target, BookOpen, GraduationCap, Timer
    };
    return icons[iconName] || Lightbulb;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Полезные советы</h1>
          <p className="text-gray-500 mt-3 font-medium text-lg leading-relaxed">Хаки для эффективной и легкой учёбы от ИИ. 💡</p>
        </div>
        <button 
          onClick={fetchNewTips}
          disabled={loading}
          className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${loading ? 'bg-white/5 text-gray-400 animate-pulse' : 'bg-sage text-white shadow-sage/20 hover:bg-sage/90'}`}
        >
          {loading ? 'Обновление...' : <><Zap size={18} /> Обновить советы</>}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tips.length > 0 ? tips.map((tip, i) => {
          const IconComponent = getIcon(tip.icon);
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="card group hover:scale-[1.02] active:scale-95 cursor-default flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-sage mb-6 shadow-xl">
                <IconComponent size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sage transition-colors">{tip.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">{tip.content}</p>
            </motion.div>
          );
        }) : !loading && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500">Нажми кнопку выше, чтобы получить советы! ✨</p>
          </div>
        )}
      </div>

      <div className="glass-panel p-12 bg-sage/5 border-sage/10 text-center">
         <h3 className="text-2xl font-bold text-white mb-4">Хочешь персональный план?</h3>
         <p className="text-gray-400 mb-8 max-w-xl mx-auto">Попроси Lumina составить план подготовки к конкретному экзамену или помочь разобраться в сложной теме.</p>
         <button onClick={() => setView('tutor')} className="px-10 py-4 bg-sage text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-sage/20 hover:scale-105 transition-all">Спросить Lumina</button>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [helpTask, setHelpTask] = useState<Task | null>(null);
  const [schedule, setSchedule] = useState<any>(() => {
    const saved = localStorage.getItem('lumina_schedule');
    return saved ? JSON.parse(saved) : UPDATED_SCHEDULE;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lumina_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lumina_profile');
    return saved ? JSON.parse(saved) : { name: '', grade: 'Не указано', goals: [] };
  });

  useEffect(() => {
    localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lumina_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('lumina_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const handleAskHelp = (task: Task) => {
    setHelpTask(task);
    setView('tutor');
  };

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: LayoutDashboard },
    { id: 'schedule', label: 'Уроки', icon: GraduationCap },
    { id: 'planner', label: 'План', icon: CalendarRange },
    { id: 'tutor', label: 'Тьютор', icon: Bot },
    { id: 'focus', label: 'Фокус', icon: Timer },
    { id: 'tips', label: 'Советы', icon: Lightbulb },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <div className="flex min-h-screen selection:bg-sage/10">
      <PWAInstallPrompt />
      {/* Sidebar Navigation - Narrow sage sidebar */}
      <aside className="w-24 bg-sage hidden lg:flex flex-col items-center py-10 fixed h-full z-30 shadow-2xl">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sage shadow-lg mb-12 rotate-45">
          <BrainCircuit size={28} className="-rotate-45" />
        </div>

        <nav className="flex-1 flex flex-col gap-8">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setView(item.id as View);
                if (item.id !== 'tutor') setHelpTask(null);
              }}
              className={`sidebar-icon ${view === item.id ? 'active shadow-xl shadow-black/10' : 'inactive'}`}
              title={item.label}
              aria-label={item.label}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <item.icon size={22} aria-hidden="true" />
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setView('profile')}
          className="mt-auto group cursor-pointer relative"
        >
            <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-bold text-xs">
              {profile.name?.[0] || 'L'}
            </div>
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
                Профиль
            </div>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-24">
        <div className="max-w-6xl mx-auto p-5 sm:p-8 lg:p-14 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
                {view === 'dashboard' && <DashboardView tasks={tasks} setView={setView} schedule={schedule} profile={profile} />}
                {view === 'schedule' && <ScheduleView schedule={schedule} setSchedule={setSchedule} />}
                {view === 'planner' && <PlannerView tasks={tasks} setTasks={setTasks} onAskHelp={handleAskHelp} />}
                {view === 'tutor' && <TutorView initialTask={helpTask} />}
                {view === 'focus' && <FocusTimerView />}
                {view === 'tips' && <TipsView setView={setView} />}
                {view === 'profile' && <ProfileView profile={profile} setProfile={setProfile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-sage rounded-[32px] flex items-center justify-around px-8 shadow-2xl z-40 border border-white/20">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setView(item.id as View);
              if (item.id !== 'tutor') setHelpTask(null);
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${view === item.id ? 'bg-white text-sage' : 'text-white opacity-60'}`}
            aria-label={item.label}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <item.icon size={24} aria-hidden="true" />
          </button>
        ))}
      </nav>
    </div>
  );
}
