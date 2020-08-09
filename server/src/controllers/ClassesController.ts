/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import db from '../database/connection'
import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

class ClassController {
  async index (req: Request, res: Response) {
    const filters = req.query

    if (!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).json({
        error: 'Missing filters to search classes'
      })
    }

    const subject = filters.subject as string
    const time = filters.time as string
    const week_day = filters.week_day as string

    const timeInMinutes = convertHourToMinutes(time)
    try {
      const classes = await db('classes')
        .whereExists(function () {
          this.select('*')
            .from('class_schedule')
            .whereRaw('class_schedule.class_id = classes.id')
            .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
            .whereRaw('class_schedule.from <= ??', [timeInMinutes])
            .whereRaw('class_schedule.to > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*'])

      return res.json(classes)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: 'error fetching data', more: error })
    }
  }

  async store (req: Request, res: Response) {
    const { name, avatar, bio, whatsapp, subject, cost, schedule } = req.body

    const trx = await db.transaction()

    try {
      const insertedUserIds = await db('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      }).returning('id')

      const user_id = insertedUserIds[0]

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      }).returning('id')

      const class_id = insertedClassesIds[0]

      const classeSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to)
        }
      })

      await trx('class_schedule').insert(classeSchedule)

      await trx.commit()

      return res.status(201).send()
    } catch (error) {
      await trx.rollback()
      console.log(error)

      return res.status(400).json({
        error: 'Unexpected error while creating new class'
      })
    }
  }
}

export default new ClassController()
