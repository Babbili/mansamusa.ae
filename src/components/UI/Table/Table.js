import React from 'react'
import TableBody from './TableBody/TableBody'
import TableHeader from './TableHeader/TableHeader'

import styles from './Table.module.scss'


const Table = ({ t, lang, items, schema, collection, currentPage, limit, ...props }) => {

  return(

    <table className={styles.Table}>
      <TableHeader
        schema={schema}
        collection={collection}
      />
      <TableBody
        t={t}
        lang={lang}
        limit={limit}
        items={items}
        schema={schema}
        collection={collection}
        currentPage={currentPage}
        {...props}
      />
    </table>

  )

}

export default Table
