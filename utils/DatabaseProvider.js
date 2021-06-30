import * as SQLite from "expo-sqlite"
//import moment from "moment"
import { getFollowingPreferences } from "./FollowingPreference"
//import { follow_key_switch_lyla, follow_key_switch_asser } from "./strings"

const DATABASE_NAME = "squawker.db"

const SQUAWK_MESSAGES = "squawk_messages"
export const COLUMN_ID = "_id"
export const COLUMN_AUTHOR = "author"
export const COLUMN_AUTHOR_KEY = "authorKey"
export const COLUMN_MESSAGE = "message"
export const COLUMN_DATE = "date"

const db = SQLite.openDatabase(DATABASE_NAME)

export const createTable = (db) => {
    const query = "CREATE TABLE IF NOT EXISTS " +  SQUAWK_MESSAGES + "(" +
                COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COLUMN_AUTHOR + " TEXT NOT NULL, " +
                COLUMN_AUTHOR_KEY + " TEXT NOT NULL, " +
                COLUMN_MESSAGE + " TEXT NOT NULL, " +
                COLUMN_DATE + " INTEGER NOT NULL, " +
                "UNIQUE (" + COLUMN_ID + ") ON CONFLICT REPLACE" +
                 ");"

    db.transaction((tx) => {
        //tx.executeSql("DROP TABLE IF EXISTS "+SQUAWK_MESSAGES); //used for debugging
        tx.executeSql(query)
    },
    (e) => {
        console.log("ERROR: " + e.message)
    })
}

export const listAllSquawks = (db) => {

    /*
    We used the comment query to test out that the Flatlist in the MainComponent works
    
    const time = moment().valueOf() //NOTE: moment().format('x') returns time in ms but in a string

    const value1 = [ time, follow_key_switch_lyla, "TheRealLyla", "My nose iteches"]
    const value2 = [ time, follow_key_switch_asser, "TheRealAsser", "I have the best hat"]
    console.log([...value1, ...value2])
    const SQL_MOCK_BULK_INSERT = "INSERT INTO "+SQUAWK_MESSAGES + ` (${COLUMN_DATE},${COLUMN_AUTHOR_KEY},${COLUMN_AUTHOR},${COLUMN_MESSAGE}) VALUES `
                        + "(?,?,?,?),(?,?,?,?)"*/

    return new Promise(async (resolve, reject) => {

        const following  = await getFollowingPreferences()
        const whereClause = createSelectionForCurrentFollowers(following)
        const query = "SELECT " + 
                        COLUMN_ID + ", " +
                        COLUMN_AUTHOR + ", " +
                        COLUMN_AUTHOR_KEY + ", " +
                        COLUMN_MESSAGE + ", " +
                        COLUMN_DATE + " " +
                        "FROM " + SQUAWK_MESSAGES + " " +
                        "WHERE " + whereClause + 
                        "ORDER BY " + COLUMN_DATE + " DESC;" 

        db.transaction(
            async (tx) => {
                //tx.executeSql( SQL_MOCK_BULK_INSERT, [...value1, ...value2], )
                tx.executeSql( query, [], (_, { rows: { _array } }) => resolve(_array) )
            },
            (e) => {
                reject("ERROR: " + e.message)
                console.log("ERROR: " + e.message)
            }
        )
    })
}

/**
* Creates a SQLite SELECTION parameter that filters just the rows for the authors you are
* currently following.
* 
* https://www.sqlitetutorial.net/sqlite-where/
*/
const  createSelectionForCurrentFollowers = (following) => {

    const TEST_ACCOUNT_KEY = "key_test"
    const stringBuilder = []

    //Automatically add the test account
    stringBuilder.push(COLUMN_AUTHOR_KEY," IN  ('", TEST_ACCOUNT_KEY ,"'")

    for (const index in following) {
        if(following[index].value){
            stringBuilder.push("'", following[index].prefKey ,"'")
        }
    }
    stringBuilder.push(")")
    return stringBuilder.join("").replace(/''/g,"','")
}

export default db