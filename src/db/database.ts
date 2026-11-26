import * as SQLite from 'expo-sqlite';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

// 1. Initialize database and create the expenses table
export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);
}

// 2. CREATE: Insert a new expense with validation
export async function addExpense(
  db: SQLite.SQLiteDatabase,
  title: string,
  amount: number,
  category: string
): Promise<number> {
  if (!title.trim() || isNaN(amount) || amount <= 0 || !category.trim()) {
    throw new Error('Invalid expense data provided.');
  }

  const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const result = await db.runAsync(
    'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
    [title.trim(), amount, category.trim(), date]
  );
  return result.lastInsertRowId;
}

// 3. READ (Filtered): Fetch expenses filtered by category and/or search query
export async function getFilteredExpenses(
  db: SQLite.SQLiteDatabase,
  category: string,
  searchQuery: string
): Promise<Expense[]> {
  const searchPattern = `%${searchQuery.trim()}%`;

  if (category === 'All') {
    return await db.getAllAsync<Expense>(
      'SELECT * FROM expenses WHERE title LIKE ? ORDER BY id DESC',
      [searchPattern]
    );
  }

  return await db.getAllAsync<Expense>(
    'SELECT * FROM expenses WHERE category = ? AND title LIKE ? ORDER BY id DESC',
    [category, searchPattern]
  );
}

// 4. READ (Aggregate SUM): Calculate total amount for active filter/search
export async function getFilteredTotal(
  db: SQLite.SQLiteDatabase,
  category: string,
  searchQuery: string
): Promise<number> {
  const searchPattern = `%${searchQuery.trim()}%`;
  let row: { total: number | null } | null = null;

  if (category === 'All') {
    row = await db.getFirstAsync<{ total: number | null }>(
      'SELECT SUM(amount) as total FROM expenses WHERE title LIKE ?',
      [searchPattern]
    );
  } else {
    row = await db.getFirstAsync<{ total: number | null }>(
      'SELECT SUM(amount) as total FROM expenses WHERE category = ? AND title LIKE ?',
      [category, searchPattern]
    );
  }

  return row?.total ?? 0;
}

// 5. UPDATE: Edit an existing expense by ID
export async function updateExpense(
  db: SQLite.SQLiteDatabase,
  id: number,
  title: string,
  amount: number,
  category: string
): Promise<void> {
  if (!title.trim() || isNaN(amount) || amount <= 0 || !category.trim()) {
    throw new Error('Invalid expense data provided.');
  }

  await db.runAsync(
    'UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ?',
    [title.trim(), amount, category.trim(), id]
  );
}

// 6. DELETE: Remove a specific expense by ID
export async function deleteExpense(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}