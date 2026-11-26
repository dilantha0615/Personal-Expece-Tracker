## Personal Expense Tracker (PersonalExpeceTracker)

This is a mobile expense tracker app I built using React Native, Expo, and SQLite (expo-sqlite) for our Mobile Application Development (Practical Tutorial 08) lab session.

What I Built

During this practical session, I created an offline expense tracking app using a local SQLite database. The app lets users add, view, search, filter, update, and delete daily expenses, while automatically calculating total spending.

## Main Features

Local SQLite Setup: Used SQLiteProvider in _layout.tsx to initialize the database and create the expenses table on startup.

CRUD Operations: Wrote parameterized SQL queries (? placeholders) in db/database.ts to safely insert, read, edit, and delete expenses without crashing on special characters.

Search & Category Filters: Added a search bar (LIKE) and category chips (All, Food, Transport, Bills, Other) using WHERE clauses.

Live Totals: Used SQL SUM(amount) to calculate and display total spending based on the active filter.

## Output Screenshots

All output screenshots from testing the app are saved in the Output_Screens/ folder.