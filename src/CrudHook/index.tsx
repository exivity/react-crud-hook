import { useContext, useState, useMemo } from 'react'
import { Record, IRecord } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

type RecordWithState<T> = T & Record

export type CrudRecord<T> = RecordWithState<T> & {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

export function useCrud<T> (record: IRecord): CrudRecord<T> {
  const crudManager = useContext(CrudContext)
  const [reference, forceRender] = useState({})
  const CrudRecord = useMemo(() => new Record(record, forceRender) as CrudRecord<T>, [record])

  return useMemo(() => {
    CrudRecord.save = function (options?: Options) {
      return crudManager.save(CrudRecord._record, options)
    }

    CrudRecord.delete = function (options?: Options) {
      return crudManager.delete(CrudRecord._record, options)
    }

    const state: any = { ...CrudRecord }
    const transferState = Object.keys(state).reduce((newState, key) => {
      newState[key] = {
        value: state[key]
      }

      return newState
    }, {} as any)

    return Object.create(CrudRecord, transferState)
  }, [reference, CrudRecord])
}
