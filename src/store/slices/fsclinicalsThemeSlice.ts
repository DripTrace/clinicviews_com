// src/store/themeSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface ThemeState {
//   isDarkMode: boolean;
// }

// const initialState: ThemeState = {
//   isDarkMode: false,
// };

// const themeSlice = createSlice({
//   name: 'theme',
//   initialState,
//   reducers: {
//     toggleDarkMode: (state) => {
//       state.isDarkMode = !state.isDarkMode;
//     },
//     setDarkMode: (state, action: PayloadAction<boolean>) => {
//       state.isDarkMode = action.payload;
//     },
//   },
// });

// export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
// export default themeSlice.reducer;


// src/store/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FSClinicalsThemeState {
  fsclinicalsIsDarkMode: boolean;
}

const initialState: FSClinicalsThemeState = {
  fsclinicalsIsDarkMode: false,
};

const fsclinicalsThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    fsclinicalsToggleDarkMode: (fsclinicalsState) => {
      fsclinicalsState.fsclinicalsIsDarkMode = !fsclinicalsState.fsclinicalsIsDarkMode;
    },
    fsclinicalsSetDarkMode: (fsclinicalsState, fsclinicalsAction: PayloadAction<boolean>) => {
      fsclinicalsState.fsclinicalsIsDarkMode = fsclinicalsAction.payload;
    },
  },
});

export const { fsclinicalsToggleDarkMode, fsclinicalsSetDarkMode } = fsclinicalsThemeSlice.actions;
export default fsclinicalsThemeSlice.reducer;