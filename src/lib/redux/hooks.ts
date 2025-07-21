// lib/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState, AppStore } from "./store";

// Typed dispatch hook
export const useAppDispatch: () => AppDispatch = useDispatch;

// Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// (Opsional) Typed store hook
export const useAppStore = useStore as () => AppStore;
