import { IRecord } from 'resma'
import { CrudManager } from 'lemon-curd'
import { CrudProvider } from '../Provider'
import React from 'react'
import { act, renderHook } from 'react-hooks-testing-library'
import { useCrud } from './index'

const fakeRecord = {
  type: 'company',
  attributes: {
    name: 'exivity'
  },
  relationships: {
    ceo: {
      data: {
        type: 'ceo',
        id: '1'
      },
    },
    employees: {
      data: [{ type: 'employee', id: '1' }]
    }
  }
}

const promiseError = 'Unable, Were gonna be in the Hudson.'

const promise = (record: any, options: any) => new Promise<IRecord>((resolve, reject) => {
  const toResolve = options.provideOptionsInsteadOfRecord ? options : record
  // @ts-ignore
  process.nextTick(() =>
     options.shouldResolve
        ? resolve(toResolve)
        : reject(promiseError)
  )
})

const fakeDispatchFunction = () => {}

const manager = new CrudManager({
  createRecord: promise,
  updateRecord: promise,
  deleteRecord: promise,
  extensions: {
    dispatch: fakeDispatchFunction
  }
})

const Wrapper = ({ children }: any) => <CrudProvider value={manager}>{children}</CrudProvider>

test('Calling setters triggers a rerender', async (done) => {
  const { result, waitForNextUpdate } = renderHook(() => useCrud(fakeRecord), { wrapper: Wrapper })

  setTimeout(() => act(() => {
    result.current.setAttribute('name', 'Michiel de Vos')
  }), 100)

  // waitForNextUpdate triggers on render
  waitForNextUpdate().then(() => {
    expect(result.current.attributes.name).toBe('Michiel de Vos')
    done()
  })
})