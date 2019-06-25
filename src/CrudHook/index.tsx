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
  const [reference, forceRender] = useState(record)

  const crudRecord = useMemo(() => {
    forceRender(record)
    return new Record(record, forceRender) as CrudRecord<T>
  }, [record])

  return useMemo(() => {
    crudRecord.save = function (options?: Options) {
      return crudManager.save(crudRecord._record, options)
    }

    crudRecord.delete = function (options?: Options) {
      return crudManager.delete(crudRecord._record, options)
    }

    const newInstance = Object.create(crudRecord)
    newInstance._record = reference

    return newInstance
  }, [reference, crudRecord])
}
