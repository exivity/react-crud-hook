import { useEffect, useContext, useState, useMemo } from 'react'
import { Record, IRecord, Dispatcher } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

type RecordWithState<T> = T & Record

export type CrudRecord<T> = RecordWithState<T> & {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

export function useRecordState (record: IRecord) {
  const { store } = useContext(CrudContext)
  const [prevRecord, setPrev] = useState(record)
  const [storedRecord, setStoredRecord] = useState(record)

  const [id, dispatcher] = useMemo(() => {
    const storeId = store.register(record)
    return [storeId, store.dispatcher(storeId)]
  }, [record])

  useEffect(() => store.subscribe(id, setStoredRecord), [record])

  if (prevRecord !== record) {
    setStoredRecord(record)
    setPrev(record)
  }

  return [storedRecord, dispatcher, id] as [IRecord, ReturnType<Dispatcher['create']>, number]
}

export function useCrud<T> (record: IRecord): CrudRecord<T> {
  const { manager, store } = useContext(CrudContext)
  const [state, dispatcher, id] = useRecordState(record)

  return useMemo(() => {
    const crudRecord = new Record(state, dispatcher) as CrudRecord<T>

    crudRecord.save = function (options?: Options) {
      return manager.save(store.getRecord(id), options)
    }

    crudRecord.delete = function (options?: Options) {
      return manager.delete(store.getRecord(id), options)
    }

    return crudRecord
  }, [state])
}