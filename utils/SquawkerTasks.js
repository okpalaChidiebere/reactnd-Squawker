import db, { insertSquawk } from "./DatabaseProvider"
import store from "../store/configureStore"
import { handleAddSquawk } from "../actions"


export default async function executeTask(data) {
    /**
     * FYI: ideally, you will add action key inside your data object, 
     * so you can perform different tasks here. 
     * Look at the Hydration Reminder APP on how you would do this
    */
    store.dispatch(handleAddSquawk(data)) //it will not hurt updating the store even when your app is terminated. It just will not work :)
    insertSquawk(db, data)
}