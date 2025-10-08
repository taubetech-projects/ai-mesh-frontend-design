import { createStore, combineReducers } from "redux";
import { chatInterfaceReducer } from "./chat-interface-reducer";

const rootReducer = combineReducers({
  chatInterface: chatInterfaceReducer,
});

const store = createStore(rootReducer);
export default store;
