// Lab data — single source of truth
import type { Lab } from "@/types";
import { lab01 } from "@/data/labs/lab01";
import { lab02 } from "@/data/labs/lab02";
import { lab03 } from "@/data/labs/lab03";
import { lab04 } from "@/data/labs/lab04";
import { lab05 } from "@/data/labs/lab05";
import { lab06 } from "@/data/labs/lab06";
import { lab07 } from "@/data/labs/lab07";
import { lab08 } from "@/data/labs/lab08";
import { lab09 } from "@/data/labs/lab09";
import { lab10 } from "@/data/labs/lab10";
import { lab11 } from "@/data/labs/lab11";
import { lab12 } from "@/data/labs/lab12";
import { lab13 } from "@/data/labs/lab13";
import { lab14 } from "@/data/labs/lab14";
import { lab15 } from "@/data/labs/lab15";
import { lab16 } from "@/data/labs/lab16";
import { lab17 } from "@/data/labs/lab17";
import { lab18 } from "@/data/labs/lab18";
import { lab19 } from "@/data/labs/lab19";
import { lab20 } from "@/data/labs/lab20";
import { lab21 } from "@/data/labs/lab21";
import { lab22 } from "@/data/labs/lab22";

export const LABS: Lab[] = [
  lab01, lab02, lab03, lab04, lab05, lab06, lab07, lab08, lab09, lab10, lab11,
  lab12, lab13, lab14, lab15, lab16, lab17, lab18, lab19, lab20, lab21, lab22,
];

export function getAllLabs(): Lab[] {
  return LABS;
}

export function getLabById(id: string): Lab | undefined {
  return LABS.find((l) => l.id === id);
}

export function getLabByNumber(num: number): Lab | undefined {
  return LABS.find((l) => l.number === num);
}

export function getLabsByCategory(category: string): Lab[] {
  return LABS.filter((l) => l.category === category);
}
