import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../../components/AppContext'


const SupplierViewProductsTableHeader = props => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  return(

    <thead>
      <tr>
        <th>{ t('no.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('name.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('image.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('quantity.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('createdAt.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('status.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('price.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('discount.label') }</th>
        <th style={{textAlign: lang === 'ar' ? 'right' : 'left'}}>{ t('collectedAmount.label') }</th>
        <th/>
      </tr>
    </thead>

  )

}

export default SupplierViewProductsTableHeader
