import * as SQLite from "expo-sqlite/next";
import { DATABASE_NAME, insertSquawk } from "./DatabaseProvider";
import { store } from "../configurestore";
import { addSquawk } from "../reducers";

export default async function executeTask(data: Record<string, any>) {
  /**
   * FYI: ideally, you will add action key inside your data object,
   * so you can perform different tasks here.
   * Look at the Hydration Reminder APP on how you would do this
   */
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  const { author, date, message, authorKey } = data;
  const squawk = { author, date: Number(date), message, authorKey };
  if (author) {
    store.dispatch(addSquawk({ squawk }));
    insertSquawk(db, squawk);
  }
}
