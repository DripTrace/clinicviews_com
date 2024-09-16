// // src/redux/actions/asyncActions.ts

// import { ThunkAction } from "redux-thunk";
// // import { ConvoRootState } from "../convoStore";
// import { ConvoActionTypes } from "./convoActions";
// import { ConvoRootState } from "../stores/convoStore";

// export const fetchConversations = (): ThunkAction<
//   void,
//   ConvoRootState,
//   unknown,
//   ConvoActionTypes
// > => async (dispatch) => {
//   try {
//     const response = await fetch("/api/conversations");
//     const data = await response.json();
//     // Dispatch an action with the fetched data
//   } catch (error) {
//     // Handle error
//   }
// };
