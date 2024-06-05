import { category } from "@/lib/schema";
import { db } from "../script-db";
import { uuidv7 } from "uuidv7";

const data = [
  {
    id: "02c4e72d-1e84-4c38-be35-f4cf05cc81b2",
    name: "Binary",
    slug: "binary",
    position: 4,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "185cb940-3b7e-4b2f-b17c-8a940f11cd82",
    name: "String",
    slug: "string",
    position: 2,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "3e46628a-8406-4322-8f23-081d3b7ff576",
    name: "Dynamic Programming",
    slug: "dynamic-programming",
    position: 10,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "4350a143-8fd0-4ba2-9923-2c2a5af4f4f9",
    name: "Linked List",
    slug: "linked-list",
    position: 3,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "9a7882ac-d924-4963-900f-7495d932aeed",
    name: "Graph",
    slug: "graph",
    position: 9,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "b83a3612-67ac-40b0-93e6-b351b54d07f9",
    name: "Tree",
    slug: "tree",
    position: 6,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "d4eb6502-9b49-41b8-a076-5e372330aa89",
    name: "Matrix",
    slug: "matrix",
    position: 5,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "f76bec7a-0b56-473e-93c8-d87588b2c397",
    name: "Heap",
    slug: "heap",
    position: 8,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "f9a86ea4-55a8-4515-9ab8-a7fe7decce1e",
    name: "Interval",
    slug: "interval",
    position: 7,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
  {
    id: "fc638a61-885c-421f-a442-0e9245a5ce9b",
    name: "Arrays",
    slug: "arrays",
    position: 1,
    created_at: "2024-05-09 09:40:58",
    updated_at: "2024-05-09 09:40:58",
  },
];

for (const d of data) {
  await db.insert(category).values({
    id: uuidv7(),
    name: d.name,
    slug: d.slug,
    position: d.position,
  });
}
