import { useEffect, useContext, useState, useMemo } from 'react'
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

  const crud = useMemo(() => {
    forceRender(record)
    return new Record(record) as CrudRecord<T>
  }, [record])

  useEffect(() => crud.subscribe(forceRender), [record])

  return useMemo(() => {
    crud._record = reference

    crud.save = function (options?: Options) {
      return crudManager.save(crud._record, options)
    }

    crud.delete = function (options?: Options) {
      return crudManager.delete(crud._record, options)
    }

    return crud
  }, [reference, crud])
}
