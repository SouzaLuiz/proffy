import { useState } from 'react'

function useForm (defaultValues: any) {
  const [values, setValues] = useState(defaultValues)

  function handleChange (field: string, value: string) {
    setValues({
      ...values,
      [field]: value
    })
  }

  return {
    values,
    handleChange
  }
}

export default useForm
