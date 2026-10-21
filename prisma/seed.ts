import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SPECIALTIES = [
  "Retina und Glaskörper",
  "Glaukom",
  "Katarakt und Intraokularlinsen",
  "Hornhaut und äußere Augenerkrankungen",
  "Uveitis",
  "Neuroophthalmologie",
  "Kinderophthalmologie und Strabologie",
  "Lider, Tränenwege und Orbita",
  "Augenverletzungen und Notfälle",
  "Refraktion und Optik",
  "Allgemeine Augenheilkunde",
  "Diagnostik und Bildgebung",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.registrationSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, registrationOpen: true },
  });

  for (const [index, name] of SPECIALTIES.entries()) {
    await prisma.specialty.upsert({
      where: { name },
      update: { order: index },
      create: { name, slug: slugify(name), order: index },
    });
  }

  const username = process.env.ADMIN_SEED_USERNAME ?? "admin";
  const email = process.env.ADMIN_SEED_EMAIL ?? null;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!password) {
    console.warn(
      "ADMIN_SEED_PASSWORD not set — skipping admin account creation. " +
        "Set it in .env and re-run `npx prisma db seed` to create the first admin.",
    );
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        email,
        passwordHash,
        role: "ADMIN",
        status: "APPROVED",
      },
    });
    console.log(`Seeded admin account: ${admin.username} (status=${admin.status})`);
  }

  console.log(`Seeded ${SPECIALTIES.length} specialties.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
