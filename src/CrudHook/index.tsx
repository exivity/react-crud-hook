import { useContext, useState, useEffect, useRef, useMemo } from 'react'

import { Record, IRecord, createRecord } from 'resma'
import { Options } from 'lemon-curd'
import { CrudContext } from '../Provider'

export interface CrudRecord extends Record {
  save: (options?: Options) => void
  delete: (options?: Options) => void
}

function usePrevious(value: any) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export function useCrud (record: IRecord): CrudRecord {
  const previousRecord = usePrevious(record)
  const crudManager = useContext(CrudContext)
  const [state, setState] = useState(createRecord(record))
  const [crudRecord, subscribe] = state

  useEffect(() => {
    if (previousRecord && previousRecord !== record) {
      setState(createRecord(record))
    }
  }, [record])

  useEffect(() => subscribe((updatedRecord: Record) => {
    setState(createRecord(updatedRecord))
  }), [state])

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

