import React from 'react'


const DashboardItemDetailsTableHeader = ({ lang, items, schema }) => {


  return(

    <thead>
      <tr>
        {
          schema.map((s, i) => {

            if (s.type === 'map') {

              let compare = items.map(f => f[s.field]).flat(1).filter(f => f !== undefined)

              let uniq = []

              compare.forEach(el => {

                let arr = uniq.filter(f => f.name.en === el.name.en).length

                if (arr === 0) {

                  uniq = [...uniq, el]

                }

              })

              return(

                uniq.map((m, i) => (

                  <th key={i}>
                    {
                      typeof m === 'object' ?
                        m.name[lang] : m.name
                    }
                  </th>

                ))

              )

            } else {

              return(

                <th key={i}>
                  { s.title }
                </th>

              )

            }

          })
        }
      </tr>
    </thead>

  )

}

export default DashboardItemDetailsTableHeader
