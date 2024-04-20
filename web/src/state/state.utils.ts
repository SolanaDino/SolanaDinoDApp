import { TypedUseSelectorHook, useDispatch, useSelector, shallowEqual as reduxShallowEqual } from 'react-redux'
import type { RootState, AppDispatch } from 'state/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const shallowEqual = reduxShallowEqual;
