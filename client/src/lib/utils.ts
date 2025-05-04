import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = dateObj.toDateString() === today.toDateString();
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();
  
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  if (isToday) {
    return `Today, ${formattedTime}`;
  } else if (isYesterday) {
    return `Yesterday, ${formattedTime}`;
  } else {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + `, ${formattedTime}`;
  }
}

export function formatDateForTimeline(date: Date | string): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = dateObj.toDateString() === today.toDateString();
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();
  
  if (isToday) {
    return 'TODAY - ' + dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  } else if (isYesterday) {
    return 'YESTERDAY - ' + dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  } else {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  }
}

export function getSourceIcon(source: string): string {
  switch (source.toLowerCase()) {
    case 'browser':
    case 'chrome':
    case 'firefox':
    case 'safari':
      return 'public';
    case 'chat':
    case 'chatgpt':
    case 'grok':
      return 'chat';
    case 'file':
    case 'files':
    case 'document':
    case 'documents':
      return 'folder';
    case 'email':
    case 'gmail':
    case 'outlook':
      return 'email';
    case 'photo':
    case 'photos':
    case 'photoshop':
      return 'photo';
    case 'social':
    case 'discord':
    case 'snapchat':
    case 'instagram':
      return 'people';
    default:
      return 'description';
  }
}

export function getSourceColor(source: string): { bg: string; text: string } {
  switch (source.toLowerCase()) {
    case 'browser':
    case 'chrome':
    case 'firefox':
    case 'safari':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'chat':
    case 'chatgpt':
    case 'grok':
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    case 'file':
    case 'files':
    case 'document':
    case 'documents':
      return { bg: 'bg-sky-100', text: 'text-sky-700' };
    case 'email':
    case 'gmail':
    case 'outlook':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'photo':
    case 'photos':
    case 'photoshop':
      return { bg: 'bg-rose-100', text: 'text-rose-700' };
    case 'social':
    case 'discord':
    case 'snapchat':
    case 'instagram':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
    default:
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
  }
}
