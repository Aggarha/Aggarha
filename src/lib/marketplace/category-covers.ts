/**
 * Curated category cover art (public/images/categories), statically imported
 * so next/image gets intrinsic size and a blur placeholder. Keyed by exact
 * category slug — subcategories deliberately do NOT inherit a parent's cover;
 * categories without one keep the demo product photo from demo-content.
 */
import type { StaticImageData } from "next/image";
import books from "../../../public/images/categories/books.webp";
import camping from "../../../public/images/categories/camping.webp";
import cars from "../../../public/images/categories/cars.webp";
import construction from "../../../public/images/categories/construction.webp";
import djSystems from "../../../public/images/categories/dj-systems.webp";
import electronics from "../../../public/images/categories/electronics.webp";
import eventEquipment from "../../../public/images/categories/event-equipment.webp";
import experiences from "../../../public/images/categories/experiences.webp";
import fashion from "../../../public/images/categories/fashion.webp";
import furniture from "../../../public/images/categories/furniture.webp";
import gaming from "../../../public/images/categories/gaming.webp";
import powerTools from "../../../public/images/categories/power-tools.webp";

const CATEGORY_COVERS: Record<string, StaticImageData> = {
  books,
  camping,
  cars,
  construction,
  "dj-systems": djSystems,
  electronics,
  "event-equipment": eventEquipment,
  experiences,
  fashion,
  furniture,
  gaming,
  "power-tools": powerTools
};

export function getCategoryCover(categorySlug: string): StaticImageData | null {
  return CATEGORY_COVERS[categorySlug] ?? null;
}
