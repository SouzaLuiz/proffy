import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useForm from '../../hooks/useForm'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import TextArea from '../../components/TextArea'
import Select from '../../components/Select'

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import api from '../../services/api'

const inputValues = {
  name: '',
  avatar: '',
  whatsapp: '',
  bio: '',
  subject: '',
  cost: ''
}

function TeacherForm () {
  const { values, handleChange } = useForm(inputValues)

  const history = useHistory()

  const [scheduleItems, setScheduleItems] = useState([
    { week_day: 0, from: '', to: '' }
  ])

  function addNewScheduleItem () {
    setScheduleItems([
      ...scheduleItems,
      { week_day: 0, from: '', to: '' }
    ])
  }

  function handleSendForm (event: any) {
    event.preventDefault()

    api.post('/classes', {
      ...values,
      cost: Number(values.cost),
      schedule: scheduleItems
    }).then(() => {
      alert('Cadastrado com sucesso')
      history.push('/')
    }).catch(() => {
      alert('erro ao cadastrar')
    })
  }

  function setScheduleItemValue (position: number, field: string, value: string) {
    const updatedScheduleItem = scheduleItems.map((scheduleItem, index) => {
      if (index === position) {
        return { ...scheduleItem, [field]: value }
      }

      return scheduleItem
    })

    setScheduleItems(updatedScheduleItem)
  }

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title="Que incrível que você quer dar aulas."
        description="O primeiro passo é preencher esse formulário de incrição"
      />

      <main>
        <form onSubmit={handleSendForm}>
          <fieldset>
            <legend>Seus dados</legend>

            <Input
              name="name"
              label="Nome completo"
              value={values.name}
              onChange={(event) => {
                handleChange('name', event.target.value)
              }}
            />

            <Input
              name="avatar"
              label="Avatar"
              value={values.avatar}
              onChange={(event) => {
                handleChange('avatar', event.target.value)
              }}
            />

            <Input
              name="whatsapp"
              type="number"
              label="Whatsapp"
              value={values.whatsapp}
              onChange={(event) => {
                handleChange('whatsapp', event.target.value)
              }}
            />

            <TextArea
              name="bio"
              label="Biografia"
              value={values.bio}
              onChange={(event) => {
                handleChange('bio', event.target.value)
              }}
            />
          </fieldset>

          <fieldset>
            <legend>Sobre a aula</legend>

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

            <Input
              name="cost"
              label="Custo de sua hora por aula"
              value={values.cost}
              onChange={(event) => {
                handleChange('cost', event.target.value)
              }}
            />
          </fieldset>

          <fieldset>
            <legend>
              Horários disponíveis

              <button type="button" onClick={addNewScheduleItem}>
              + novo horário
              </button>
            </legend>

            {scheduleItems.map((scheduleItem, index) => {
              return (
                <div key={scheduleItem.week_day} className="schedule-item">
                  <Select
                    name="week_day"
                    label="Dia da semana"
                    value={scheduleItem.week_day}
                    onChange={(event) =>
                      setScheduleItemValue(index, 'week_day', event.target.value)
                    }
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
                    name="from"
                    label="Das"
                    type="time"
                    value={scheduleItem.from}
                    onChange={(event) => {
                      setScheduleItemValue(index, 'from', event.target.value)
                    }}
                  />

                  <Input
                    name="to"
                    label="Até"
                    type="time"
                    value={scheduleItem.to}
                    onChange={(event) => {
                      setScheduleItemValue(index, 'to', event.target.value)
                    }}
                  />
                </div>
              )
            })}
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante"/>
            Importante! <br />
            Preencha todos os dados
            </p>
            <button type="submit">
              Salvar cadastro
            </button>
          </footer>
        </form>
      </main>
    </div>
  )
}

export default TeacherForm
