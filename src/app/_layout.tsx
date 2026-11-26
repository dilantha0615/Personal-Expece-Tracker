import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../db/database';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="expenses.db" onInit={initDatabase}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Expense Tracker',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}