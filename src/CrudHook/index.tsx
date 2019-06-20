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
  console.log('render')

  useEffect(() => {
    if (previousRecord && previousRecord !== record) {
      setState(createRecord(record))
      console.log('reset')
    }
  }, [record])

  useEffect(() => {
    console.log('effect', crudRecord, subscribe)
    return subscribe((updatedRecord: Record) => {
      console.log('listener', updatedRecord)
      setState(createRecord(updatedRecord))
    })
  }, [state])

  return useMemo(() => {
    crudRecord.save = function (options?: Options) {
      return crudManager.save(crudRecord.record, options)
    }

    crudRecord.delete = function (options?: Options) {
      return crudManager.delete(crudRecord.record, options)
    }

    console.log('meme', crudRecord)
    return crudRecord
  }, [state])
}

