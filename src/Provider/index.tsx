import React, { useMemo, createContext } from 'react'
import { Store, Dispatcher, Reducer } from 'resma'
import { CrudManager } from 'lemon-curd'

const recordStore = new Store({
  dispatcher: new Dispatcher(),
  reducer: new Reducer()
})

export const CrudContext = createContext<{
  manager: CrudManager,
  store: Store
}>({
  manager: new CrudManager({
    createRecord: () => new Promise(() => {}),
    updateRecord: () => new Promise(() => {}),
    deleteRecord: () => new Promise(() => {}),
    extensions: {}
  }),
  store: recordStore
})

export interface Provider {
  manager: CrudManager
  store?: Store
  children: any
}

const CrudProvider = ({ manager, store = recordStore, children }: Provider) => {
  const context = useMemo(() => ({ manager, store }), [manager, store])

  return (
     <CrudContext.Provider value={context}>
       {children}
     </CrudContext.Provider>
  )
}

export {
  Store,
  Dispatcher,
  Reducer,
  CrudManager,
  CrudProvider
}