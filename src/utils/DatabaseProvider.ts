import * as SQLite from "expo-sqlite/next";
import { getFollowingPreferences } from "./FollowingPreference";
import { Squawk } from "./types";

export const DATABASE_NAME = "squawker.db";

const SQUAWK_MESSAGES = "squawk_messages";
export const COLUMN_ID = "_id";
export const COLUMN_AUTHOR = "author";
export const COLUMN_AUTHOR_KEY = "authorKey";
export const COLUMN_MESSAGE = "message";
export const COLUMN_DATE = "date";

export const createTable = async (db: SQLite.SQLiteDatabase) => {
  const query =
    "CREATE TABLE IF NOT EXISTS " +
    SQUAWK_MESSAGES +
    "(" +
    COLUMN_ID +
    " INTEGER PRIMARY KEY AUTOINCREMENT, " +
    COLUMN_AUTHOR +
    " TEXT NOT NULL, " +
    COLUMN_AUTHOR_KEY +
    " TEXT NOT NULL, " +
    COLUMN_MESSAGE +
    " TEXT NOT NULL, " +
    COLUMN_DATE +
    " INTEGER NOT NULL, " +
    "UNIQUE (" +
    COLUMN_ID +
    ") ON CONFLICT REPLACE" +
    ");";

  // await db.runAsync("DROP TABLE IF EXISTS " + SQUAWK_MESSAGES); //used for debugging;
  await db.execAsync(query).catch((e) => {
    console.error("ERROR: " + e.message);
  });
};

export const insertSquawk = async (db: SQLite.SQLiteDatabase, data: Squawk) => {
  const SQL_INSERT =
    "INSERT INTO " +
    SQUAWK_MESSAGES +
    ` (${COLUMN_AUTHOR},${COLUMN_AUTHOR_KEY},${COLUMN_DATE},${COLUMN_MESSAGE}) VALUES ` +
    "(?,?,?,?)";

  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(SQL_INSERT, [
        data.author,
        data.authorKey,
        data.date,
        data.message,
      ]);
    });
  } catch (e) {
    console.log("ERROR: " + e.message);
  }
};

export const createSelectionFormAllSquawks = () => {
  const following = getFollowingPreferences();
  const whereClause = createSelectionForCurrentFollowers(following);

  return (
    "SELECT " +
    //COLUMN_ID + ", " +
    COLUMN_AUTHOR +
    ", " +
    COLUMN_AUTHOR_KEY +
    ", " +
    COLUMN_MESSAGE +
    ", " +
    COLUMN_DATE +
    " " +
    "FROM " +
    SQUAWK_MESSAGES +
    " " +
    "WHERE " +
    whereClause +
    "ORDER BY " +
    COLUMN_DATE +
    " DESC;"
  );
};

/**
 * Creates a SQLite SELECTION parameter that filters just the rows for the authors you are
 * currently following.
 *
 * https://www.sqlitetutorial.net/sqlite-where/
 */
export const createSelectionForCurrentFollowers = (
  following: ReturnType<typeof getFollowingPreferences>
) => {
  const TEST_ACCOUNT_KEY = "key_test";
  const stringBuilder = [];

  //Automatically add the test account
  stringBuilder.push(COLUMN_AUTHOR_KEY, " IN  ('", TEST_ACCOUNT_KEY, "'");

  for (const index in following) {
    if (following[index].value) {
      stringBuilder.push("'", following[index].prefKey, "'");
    }
  }
  stringBuilder.push(")");
  return stringBuilder.join("").replace(/''/g, "','");
};

// export default db;
