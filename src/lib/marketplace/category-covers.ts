/**
 * Curated category cover art (public/images/categories), statically imported
 * so next/image gets intrinsic size and a blur placeholder. Keyed by exact
 * category slug — subcategories deliberately do NOT inherit a parent's cover;
 * categories without one keep the demo product photo from demo-content.
 */
import type { StaticImageData } from "next/image";
import books from "../../../public/images/categories/books.webp";
import cameraLenses from "../../../public/images/categories/camera-lenses.webp";
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
import gamingConsoles from "../../../public/images/categories/gaming-consoles.webp";
import kids from "../../../public/images/categories/kids.webp";
import motorcycles from "../../../public/images/categories/motorcycles.webp";
import musicalInstruments from "../../../public/images/categories/musical-instruments.webp";
import pets from "../../../public/images/categories/pets.webp";
import photography from "../../../public/images/categories/photography.webp";
import powerTools from "../../../public/images/categories/power-tools.webp";
import professionalEquipment from "../../../public/images/categories/professional-equipment.webp";
import realEstate from "../../../public/images/categories/real-estate.webp";
import services from "../../../public/images/categories/services.webp";
import sports from "../../../public/images/categories/sports.webp";
import wedding from "../../../public/images/categories/wedding.webp";
import weddingDresses from "../../../public/images/categories/wedding-dresses.webp";

const CATEGORY_COVERS: Record<string, StaticImageData> = {
  books,
  "camera-lenses": cameraLenses,
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
  "gaming-consoles": gamingConsoles,
  kids,
  motorcycles,
  "musical-instruments": musicalInstruments,
  pets,
  photography,
  "power-tools": powerTools,
  "professional-equipment": professionalEquipment,
  "real-estate": realEstate,
  services,
  sports,
  wedding,
  "wedding-dresses": weddingDresses
};

export function getCategoryCover(categorySlug: string): StaticImageData | null {
  return CATEGORY_COVERS[categorySlug] ?? null;
}
