import { useContext, useState, useMemo } from 'react'
import { Record, IRecord } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

export interface CrudRecord extends Record {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

export function useCrud (record: IRecord): CrudRecord {
  const crudManager = useContext(CrudContext)
  const [reference, forceRender] = useState({})
  const CrudRecord = useMemo(() => new Record(record, forceRender) as CrudRecord, [record])

  return useMemo(() => {
    CrudRecord.save = function (options?: Options) {
      return crudManager.save(CrudRecord._record, options)
    }

    CrudRecord.delete = function (options?: Options) {
      return crudManager.delete(CrudRecord._record, options)
    }

    return Object.create(CrudRecord)
  }, [reference, record])
}
