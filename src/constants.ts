import { Subject } from './types';
import { 
  Calculator, 
  History, 
  PenTool, 
  MessageCircle, 
  Monitor, 
  Languages, 
  ListTodo 
} from 'lucide-react';

export const SUBJECT_CONFIG = {
  [Subject.ALGEBRA]: { icon: Calculator, color: 'bg-[#E0E7FF] text-[#4338CA]', border: 'border-[#C7D2FE]' },
  [Subject.HISTORY]: { icon: History, color: 'bg-[#FEF3C7] text-[#B45309]', border: 'border-[#FDE68A]' },
  [Subject.RUSSIAN]: { icon: PenTool, color: 'bg-[#F3E8FF] text-[#7E22CE]', border: 'border-[#E9D5FF]' },
  [Subject.IMPORTANT]: { icon: MessageCircle, color: 'bg-[#DCFCE7] text-[#15803D]', border: 'border-[#BBF7D0]' },
  [Subject.CS]: { icon: Monitor, color: 'bg-[#E0F2FE] text-[#0369A1]', border: 'border-[#BAE6FD]' },
  [Subject.ENGLISH_SPEC]: { icon: Languages, color: 'bg-[#FCE7F3] text-[#BE185D]', border: 'border-[#FBCFE8]' },
  [Subject.OTHER]: { icon: ListTodo, color: 'bg-[#F3F4F6] text-[#374151]', border: 'border-[#E5E7EB]' },
};

export const DEFAULT_SCHEDULE: any = {
  'Пн': [
    { time: '08:30', subject: 'Алгебра', room: '302' },
    { time: '09:25', subject: 'Русский язык', room: '105' },
    { time: '10:20', subject: 'История', room: '204' },
    { time: '11:15', subject: 'Физика', room: 'Лаб 1' },
    { time: '12:25', subject: 'Физкультура', room: 'Спортзал' },
  ],
  'Вт': [
    { time: '08:30', subject: 'Геометрия', room: '302' },
    { time: '09:25', subject: 'Литература', room: '105' },
    { time: '10:20', subject: 'Английский', room: '401' },
    { time: '11:15', subject: 'Биология', room: '208' },
    { time: '12:25', subject: 'Обществознание', room: '204' },
  ],
  'Ср': [
    { time: '08:30', subject: 'Химия', room: 'Лаб 2' },
    { time: '09:25', subject: 'География', room: '210' },
    { time: '10:20', subject: 'Алгебра', room: '302' },
    { time: '11:15', subject: 'Информатика', room: 'ПК 1' },
    { time: '12:25', subject: 'Музыка', room: 'Актовый зал' },
  ],
  'Чт': [
    { time: '08:30', subject: 'Литература', room: '105' },
    { time: '09:25', subject: 'Физика', room: 'Лаб 1' },
    { time: '10:20', subject: 'Английский', room: '401' },
    { time: '11:15', subject: 'Геометрия', room: '302' },
    { time: '12:25', subject: 'ОБЖ', room: '112' },
  ],
  'Пт': [
    { time: '08:30', subject: 'Русский язык', room: '105' },
    { time: '09:25', subject: 'Биология', room: '208' },
    { time: '10:20', subject: 'История', room: '204' },
    { time: '11:15', subject: 'Искусство', room: '315' },
    { time: '12:25', subject: 'Технология', room: 'Мастерская' },
  ],
};

export const UPDATED_SCHEDULE: any = {
  'Пн': [
    { time: '12:40', subject: 'Разговоры о важном', room: 'Актовый зал' },
    { time: '13:25', subject: 'Алгебра', room: '302' },
    { time: '14:10', subject: 'Русский язык', room: '105' },
    { time: '14:55', subject: 'История', room: '204' },
    { time: '15:40', subject: 'Английский язык', room: '401' },
    { time: '16:25', subject: 'Информатика', room: 'ПК 1' },
  ],
  'Вт': [
    { time: '12:40', subject: 'Информатика', room: 'ПК 1' },
    { time: '13:35', subject: 'Алгебра', room: '302' },
    { time: '14:30', subject: 'Английский язык', room: '401' },
    { time: '15:25', subject: 'Русский язык', room: '105' },
    { time: '16:20', subject: 'История', room: '204' },
  ],
  'Ср': [
    { time: '12:40', subject: 'Русский язык', room: '105' },
    { time: '13:35', subject: 'Информатика', room: 'ПК 1' },
    { time: '14:30', subject: 'Алгебра', room: '302' },
    { time: '15:25', subject: 'Английский язык', room: '401' },
    { time: '16:20', subject: 'История', room: '204' },
  ],
  'Чт': [
    { time: '12:40', subject: 'Алгебра', room: '302' },
    { time: '13:35', subject: 'История', room: '204' },
    { time: '14:30', subject: 'Русский язык', room: '105' },
    { time: '15:25', subject: 'Английский язык', room: '401' },
    { time: '16:20', subject: 'Информатика', room: 'ПК 1' },
  ],
  'Пт': [
    { time: '12:40', subject: 'Английский язык', room: '401' },
    { time: '13:35', subject: 'Алгебра', room: '302' },
    { time: '14:30', subject: 'Русский язык', room: '105' },
    { time: '15:25', subject: 'Информатика', room: 'ПК 1' },
    { time: '16:20', subject: 'История', room: '204' },
  ],
};

export const MOTIVATIONAL_QUOTES = [
  "Ты отлично справляешься! Просто делай по одному шагу за раз. ✨",
  "Твой мозг растёт с каждой задачей, которую ты решаешь! 🌱",
  "Не сравнивай свою первую главу с чьей-то двадцатой. 📖",
  "Ошибки — это просто доказательство того, что ты стараешься. Продолжай! 💖",
  "У тебя всё получится, сияющая звезда Lumina! 🌟",
  " Сосредоточься на прогрессе, а не на совершенстве. 🌈",
];
