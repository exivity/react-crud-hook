import { useEffect, useContext, useState, useMemo } from 'react'
import { Record, IRecord } from 'resma'
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

  return [storedRecord, dispatcher] as [IRecord, any]
}

export function useCrud<T> (record: IRecord): CrudRecord<T> {
  const { manager } = useContext(CrudContext)
  const [state, dispatcher] = useRecordState(record)

  return useMemo(() => {
    const crudRecord = new Record(state, dispatcher) as CrudRecord<T>

    crudRecord.save = function (options?: Options) {
      return manager.save(crudRecord._record, options)
    }

    crudRecord.delete = function (options?: Options) {
      return manager.delete(crudRecord._record, options)
    }

    return crudRecord
  }, [state])
}