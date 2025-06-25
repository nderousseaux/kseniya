// Exemple of a board, for seeding the prisma database

import { Board, Group, Item, Quote } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load image as Buffer and convert to base64 DataURL
const imageBuffer = new Uint8Array(fs.readFileSync(path.join(__dirname, 'img.jpg')));

export const board: Board = {
  id: 'board-1',
  title: 'Sample Board',
  description: 'A board for testing purposes',
  password: process.env.DEFAULT_BOARD_PASSWORD || 'default-password',
};

export const groups: Group[] = [
  {
    id: 'group-1',
    name: 'Group Alpha',
    boardId: board.id,
    posX: -400,
    posY: -400,
  },
  {
    id: 'group-2',
    name: 'Group Beta',
    boardId: board.id,
    posX: 400,
    posY: -400,
  },
  {
    id: 'group-3',
    name: 'Group Gamma',
    boardId: board.id,
    posX: -400,
    posY: 400,
  },
  {
    id: 'group-4',
    name: 'Group Delta',
    boardId: board.id,
    posX: 400,
    posY: 400,
  },
];

// Use Partial<Item> to avoid type errors for Bytes? field in placeholder data
export const items: Partial<Item>[] = [
  // Group 1: 7 items
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `item-1-${i+1}`,
    name: `Alpha Item ${i+1}`,
    description: `Description for Alpha Item ${i+1}`.repeat(Math.floor(Math.random() * 3) + 1),
    groupId: 'group-1',
    image: Math.random() < 0.1 ? imageBuffer : null, // 1 in 10 chance
  })),
  // Group 2: 8 items
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `item-2-${i+1}`,
    name: `Beta Item ${i+1}`,
    description: `Description for Beta Item ${i+1}`.repeat(Math.floor(Math.random() * 3) + 1),
    groupId: 'group-2',
    image: Math.random() < 0.1 ? imageBuffer : null, // 1 in 10 chance
  })),
  // Group 3: 6 items
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `item-3-${i+1}`,
    name: `Gamma Item ${i+1}`,
    description: `Description for Gamma Item ${i+1}`.repeat(Math.floor(Math.random() * 3) + 1),
    groupId: 'group-3',
    image: Math.random() < 0.1 ? imageBuffer : null, // 1 in 10 chance
  })),
  // Group 4: 9 items
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `item-4-${i+1}`,
    name: `Delta Item ${i+1}`,
    description: `Description for Delta Item ${i+1}`.repeat(Math.floor(Math.random() * 3) + 1),
    groupId: 'group-4',
    image: Math.random() < 0.1 ? imageBuffer : null, // 1 in 10 chance
  })),
];


export const quotes: Quote[] = [
  {
    id: 'quote-1',
    text: 'The best way to get started is to quit talking and begin doing.',
    posX: -400,
    posY: -50,
    boardId: board.id,
  },
  {
    id: 'quote-2',
    text: 'Success is not in what you have, but who you are.',
    posX: -400,
    posY: 50,
    boardId: board.id,
  },
  {
    id: 'quote-3',
    text: 'Opportunities don’t happen, you create them.',
    posX: 400,
    posY: -50,
    boardId: board.id,
  },
  {
    id: 'quote-4',
    text: 'Don’t watch the clock; do what it does. Keep going.',
    posX: 400,
    posY: 50,
    boardId: board.id,
  },
];
