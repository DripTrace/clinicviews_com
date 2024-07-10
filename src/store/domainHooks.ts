// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootDomainState, DomainDispatch } from "./domainStore";

export const useDomainDispatch = () => useDispatch<DomainDispatch>();
export const useDomainSelector: TypedUseSelectorHook<RootDomainState> =
    useSelector;

// // store/domainHooks.ts

// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './store'; // Adjust the import path as needed

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useDomainSelector: TypedUseSelectorHook<RootState> = useSelector;
