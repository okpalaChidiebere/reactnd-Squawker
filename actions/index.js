import { getFollowingPreference } from "../utils/FollowingPreference"

export const RECEIVE_SQUAWKS = "RECEIVE_SQUAWKS"
export const ADD_SQUAWK = "ADD_SQUAWK"

export function receiveSquawks (squawks) {
  return {
    type: RECEIVE_SQUAWKS,
    squawks
  }
}

function addSquawk(squawk) {
  return {
    type: ADD_SQUAWK,
    squawk
  }
}

export const handleAddSquawk = (data) => async (dispatch) => {

    //check if user is subscribed to the author
    const isFollwing = await getFollowingPreference(data.authorKey)
    
    //We only update the show updated topic squawks from only instructors the user is subscribed to
    if(isFollwing){
        dispatch(addSquawk({
            author: data.author,
            authorKey: data.authorKey,
            message: data.message,
            date: parseInt(data.date),
        }))
    }
    //If they are subscribed then you upddate the store
}