import React from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'

import styles from './DashboardItemDetailsTableItem.module.scss'


const DashboardItemDetailsTableItem = ({ lang, item, items, schema }) => {

  moment.locale(lang)

  return(

    <tr className={styles.DashboardItemDetailsTableItem}>

      {
        schema.map((s, i) => {

          let isTimestamp = s.type !== undefined && s.type === 'timestamp'
          let date = isTimestamp ? moment.unix(item[s.field]).format('LLLL') : ''
          let isBool = typeof item[s.field] === 'boolean'
          let status = item[s.field] ? 'Yes' : 'No'

          if (s.type === 'url') {

            if (item[s.field].length !== 0) {

              return(

                item[s.field].map((m, i) => (
                  <td data-label={s.title} key={i}>
                    <a href={m.url} target='_blank' rel='noopener noreferrer'>
                      Open
                    </a>
                  </td>
                ))

              )

            } else {

              return(

                <td data-label={s.title} key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>
                  —
                </td>

              )

            }

          } else if (s.type === 'map') {

            let compare = items.map(f => f[s.field]).flat(1).filter(f => f !== undefined)
            let uniq = []
            compare.forEach(el => {

              let arr = uniq.filter(f => f.name.en === el.name.en).length

              if (arr === 0) {

                uniq = [...uniq, el]

              }

            })

            if (item[s.field] !== undefined) {

              if (item[s.field].length === uniq.length) {

                return(

                  item[s.field].map((m, i) => (

                    <td data-label={m.name[lang]} key={i}>
                      {
                        typeof m.value === 'object' ?
                          m.value[lang].length !== 0 ? m.value[lang] : 'Not Provided' :
                          m.value.length !== 0 ? m.value : 'Not Provided'
                      }
                    </td>

                  ))

                )

              } else if (item[s.field].length < uniq.length) {

                let newMap = uniq.map(m => {

                  let obj = {...m}

                  item[s.field].map(i => {
                    if (obj.name.en === i.name.en) {
                      obj.value = i.value
                    } else {
                      obj.value = {en: '—', ar: '—'}
                    }
                    return i
                  })

                  return obj

                })

                return(

                  newMap.map((m, i) => (

                    <td data-label={s.title} key={i}>
                      {
                        typeof m.value === 'object' ?
                          m.value[lang].length !== 0 ? m.value[lang] : 'Not Provided' :
                          m.value.length !== 0 ? m.value : 'Not Provided'
                      }
                    </td>

                  ))

                )

              }

            } else {

              let newMap = [...uniq.map(m => {
                let obj = {...m}
                obj.value = {en: '—', ar: '—'}
                return obj
              })]

              return(

                newMap.map((m, i) => (

                  <td data-label={s.title} key={i}>
                    {
                      typeof m.value === 'object' ?
                        m.value[lang].length !== 0 ? m.value[lang] : 'Not Provided' :
                        m.value.length !== 0 ? m.value : 'Not Provided'
                    }
                  </td>

                ))

              )

            }

          } else {

            return(

              <td data-label={s.title} key={i}>
                {
                  isTimestamp ? date :
                    isBool ? status :
                      typeof item[s.field] === 'object' ?
                        item[s.field][lang] : item[s.field]
                }
              </td>

            )

          }

          return null

        })
      }

    </tr>

  )

}

export default DashboardItemDetailsTableItem
