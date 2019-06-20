import { useContext, useState, useEffect, useMemo } from 'react'

import { Record, IRecord, createRecord } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

export interface CrudRecord extends Record {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

export function useCrud (record: IRecord): CrudRecord {
  const crudManager = useContext(CrudContext)
  const [state, setState] = useState(createRecord(record))
  const [crudRecord, subscribe] = state

  useEffect(() => {
    if (crudRecord.record !== record) {
      setState(createRecord(record))
    }
  }, [record])

  useEffect(() => subscribe((updatedRecord: Record) => {
    setState(createRecord(updatedRecord))
  }))

  return useMemo(() => {
    crudRecord.save = function (options?: Options) {
      return crudManager.save(crudRecord.record, options)
    }

    crudRecord.delete = function (options?: Options) {
      return crudManager.delete(crudRecord.record, options)
    }

    return crudRecord
  }, [state])
}

