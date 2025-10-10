import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { chatInterfaceReducer } from "./chat-interface-reducer";

const rootReducer = combineReducers({
  chatInterface: chatInterfaceReducer,
});

const store = createStore(rootReducer, composeWithDevTools());
export default store;
