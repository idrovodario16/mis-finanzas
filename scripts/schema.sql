-- Inicializar una base de desarrollo vacía. No ejecutar sobre datos existentes.
CREATE TABLE IF NOT EXISTS movements (
 id TEXT PRIMARY KEY NOT NULL,
 user_id TEXT NOT NULL,
 date TEXT NOT NULL,
 type TEXT NOT NULL,
 concept TEXT NOT NULL,
 category TEXT NOT NULL,
 cents INTEGER NOT NULL,
 goal_id TEXT
);
CREATE TABLE IF NOT EXISTS goals (
 id TEXT PRIMARY KEY NOT NULL,
 user_id TEXT NOT NULL,
 name TEXT NOT NULL,
 target_cents INTEGER NOT NULL,
 monthly_cents INTEGER NOT NULL
);
