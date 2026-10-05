/**
 * Restructures the Category table into the 15-top-level taxonomy defined in
 * src/lib/marketplace/category-tree.ts.
 *
 *   npx tsx scripts/restructure-categories.ts --dry-run   # print the plan only
 *   npx tsx scripts/restructure-categories.ts             # apply
 *
 * Safe to re-run: every category is upserted by slug (create if missing,
 * otherwise update name/description/parent). Nothing is ever deleted, and
 * categories in the DB that the tree doesn't mention are left untouched.
 * Listings keep their categoryId, so no listing moves.
 *
 * Needs DATABASE_URL in the environment (same .env the app uses).
 */
import { PrismaClient } from "@prisma/client";
import { CATEGORY_TREE } from "../src/lib/marketplace/category-tree";

type Row = { slug: string; name: string; description: string; parentSlug: string | null };

const rows: Row[] = CATEGORY_TREE.flatMap((top) => [
  { slug: top.slug, name: top.name, description: top.description, parentSlug: null },
  ...(top.children ?? []).map((child) => ({ ...child, parentSlug: top.slug }))
]);

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const prisma = new PrismaClient();

  try {
    const existing = await prisma.category.findMany({ include: { parent: { select: { slug: true } } } });
    const bySlug = new Map(existing.map((category) => [category.slug, category]));

    let creates = 0;
    let updates = 0;
    for (const row of rows) {
      const current = bySlug.get(row.slug);
      if (!current) {
        creates += 1;
        console.log(`+ create ${row.slug} "${row.name}"${row.parentSlug ? ` under ${row.parentSlug}` : " (top-level)"}`);
        continue;
      }
      const changes: string[] = [];
      if (current.name !== row.name) changes.push(`name "${current.name}" -> "${row.name}"`);
      if ((current.description ?? "") !== row.description) changes.push("description");
      const currentParent = current.parent?.slug ?? null;
      if (currentParent !== row.parentSlug) changes.push(`parent ${currentParent ?? "(none)"} -> ${row.parentSlug ?? "(none)"}`);
      if (changes.length > 0) {
        updates += 1;
        console.log(`~ update ${row.slug}: ${changes.join(", ")}`);
      }
    }

    const known = new Set(rows.map((row) => row.slug));
    const untouched = existing.filter((category) => !known.has(category.slug)).map((category) => category.slug);
    if (untouched.length > 0) {
      console.log(`= left untouched (not in tree): ${untouched.join(", ")}`);
    }
    console.log(`\n${creates} to create, ${updates} to update, ${rows.length - creates - updates} already correct.`);

    if (dryRun) {
      console.log("Dry run — no changes written.");
      return;
    }

    await prisma.$transaction(async (tx) => {
      const idBySlug = new Map<string, string>();
      // Rows are ordered parent-first, so a parent's id is always known before its children.
      for (const row of rows) {
        const parentId = row.parentSlug ? idBySlug.get(row.parentSlug) ?? null : null;
        const saved = await tx.category.upsert({
          where: { slug: row.slug },
          create: { slug: row.slug, name: row.name, description: row.description, parentId },
          update: { name: row.name, description: row.description, parentId },
          select: { id: true }
        });
        idBySlug.set(row.slug, saved.id);
      }
    });

    const topLevel = await prisma.category.count({ where: { parentId: null, slug: { in: Array.from(known) } } });
    console.log(`Done. ${topLevel} top-level categories from the tree are in place.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
