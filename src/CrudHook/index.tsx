import { useEffect, useContext, useState, useMemo } from 'react'
import { Record, IRecord, DispatcherFactory, CurriedDispatchers } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

type RecordWithState<T> = T & Record<CurriedDispatchers>

export type CrudRecord<T> = RecordWithState<T> & {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

export function useRecordState (record: IRecord) {
  const { store } = useContext(CrudContext)
  const [prevRecord, setPrev] = useState(record)
  const [storedRecord, setStoredRecord] = useState(record)

  const [id, dispatcherFactory] = useMemo(() => {
    const storeId = store.register(record)
    return [storeId, store.getDispatcherFactory(storeId)]
  }, [record])

  useEffect(() => store.subscribe(id, setStoredRecord), [record])

  if (prevRecord !== record) {
    setStoredRecord(record)
    setPrev(record)
  }

  return [storedRecord, dispatcherFactory, id] as [IRecord, DispatcherFactory<CurriedDispatchers>, number]
}

export function useCrud<T> (record: IRecord): CrudRecord<T> {
  const { manager, store } = useContext(CrudContext)
  const [state, dispatcherFactory, id] = useRecordState(record)

  return useMemo(() => {
    const crudRecord = new Record(state, dispatcherFactory) as unknown as CrudRecord<T>

    crudRecord.save = function (options?: Options) {
      return manager.save(store.getRecord(id), options)
    }

    crudRecord.delete = function (options?: Options) {
      return manager.delete(store.getRecord(id), options)
    }

    return crudRecord
  }, [state])
}