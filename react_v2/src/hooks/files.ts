import {useEffect, useState} from 'react'
import FileUploadService from '../services/TemplaterService'
import axios, {AxiosError} from 'axios'


export function useProducts() {
  // const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // function addProduct(product: IProduct) {
  //   setProducts(prev => [...prev, product])
  // }

  async function fetchFiles(token: string) {
    try {
      setError('')
      setLoading(true)
      const response = await FileUploadService.getFiles(token)
      // setProducts(response.data)
      setLoading(false)
    } catch (e: unknown) {
      const error = e as AxiosError
      setLoading(false)
      setError(error.message)
    }
  }
  var token = ""
  useEffect(() => {
    fetchFiles(token)
  }, [])

  return { error, loading }
}