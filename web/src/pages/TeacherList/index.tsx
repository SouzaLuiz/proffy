import React, { useState } from 'react'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import Input from '../../components/Input'
import Select from '../../components/Select'

import useForm from '../../hooks/useForm'

import './styles.css'
import api from '../../services/api'

const inputValues = {
  subject: '',
  week_day: '',
  time: ''
}

function TeacherList () {
  const [teachers, setTeachers] = useState([])
  const { values, handleChange } = useForm(inputValues)

  async function searchTeachers (event: any) {
    event.preventDefault()

    const response = await api.get('/classes', {
      params: values
    })

    setTeachers(response.data)
  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Esses são seus proffys disponíveis.">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select
            name="subject"
            label="Matéria"
            value={values.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            options={[
              { value: 'Artes', label: 'Artes' },
              { value: 'Biologia', label: 'Biologia' },
              { value: 'Matemática', label: 'Matemática' },
              { value: 'Física', label: 'Física' },
              { value: 'Inglês', label: 'Inglês' }
            ]}
          />
          <Select
            name="week_day"
            label="Dia da semana"
            value={values.week_day}
            onChange={(event) => handleChange('week_day', event.target.value)}
            options={[
              { value: '0', label: 'Domingo' },
              { value: '1', label: 'Segunda-Feira' },
              { value: '2', label: 'Terça-Feira' },
              { value: '3', label: 'Quarta-Feira' },
              { value: '4', label: 'Quinta-Feira' },
              { value: '5', label: 'Sexta-Feira' },
              { value: '6', label: 'Sábado-Feira' }
            ]}
          />

          <Input
            name="time"
            label="Hora"
            type="time"
            value={values.timee}
            onChange={(event) => handleChange('time', event.target.value)}
          />

          <button type="submit">
            Buscar
          </button>
        </form>
      </PageHeader>

      <main>
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem key={teacher.id} teacher={teacher}/>
          )
        })}
      </main>
    </div>
  )
}

export default TeacherList
