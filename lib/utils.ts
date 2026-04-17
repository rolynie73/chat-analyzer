import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreColor(value: number) {
  if (value >= 75) return "text-green-600";
  if (value >= 50) return "text-yellow-600";
  if (value >= 25) return "text-orange-600";
  return "text-red-600";
}

export function scoreBarColor(value: number) {
  if (value >= 75) return "bg-green-500";
  if (value >= 50) return "bg-yellow-500";
  if (value >= 25) return "bg-orange-500";
  return "bg-red-500";
}
