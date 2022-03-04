import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../components/AppContext'


const TableHeader = ({ schema, collection }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  return(

    <thead>
      <tr>
        <th>{ t('no.label') }</th>
        {
          Object.values(schema).map((el, i) => (
            <th
              key={i}
              style={{
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}
            >
              { el }
            </th>
          ))
        }
        {
          collection === 'products' ?
            <th/> : null
        }
      </tr>
    </thead>

  )

}

export default TableHeader
