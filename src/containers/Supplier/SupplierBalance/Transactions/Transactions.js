import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from '../../../../components/UI/Select/Select'
import Transaction from './Transaction/Transaction'

import styles from './Transactions.module.scss'


const Transactions = props => {

  let { t } = useTranslation()

  const [toggle, setToggle] = useState(false)

  const [state, setState] = useState({
    sort: 'Cash In',
    options: [
      {
        id: '434j20j9ff',
        title: t('cashIn.label')
      },
      {
        id: 'sdfcmi04j3v',
        title: t('cashOut.label')
      }
    ]
  })


  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  useEffect(() => {

    if (props.transactions.length > 0) {
      setToggle(true)
    }

  }, [props.transactions])

  return(

    <div className={`${styles.Transactions} container-fluid`}>

      <div className='row'>
        <div className='col-8 d-flex'>
          <h5>
            { t('transactionHistoryDetails.label') }
            <div style={{width: '10px'}} />
            <div
              className={styles.showMore}
              onClick={() => setToggle(!toggle)}
            >
              { t('seeMore.label') }
              <div
                style={{
                  display: 'flex',
                  transform: toggle ? 'rotateZ(90deg)' : 'rotateZ(0deg)'
                }}
              >
                <FontAwesomeIcon icon='angle-right' fixedWidth />
              </div>
            </div>
          </h5>
        </div>
        <div className='col-4 text-right'>
          <div
            style={{
              opacity: toggle ? 1 : 0,
              pointerEvents: toggle ? 'all' : 'none'
            }}
          >
            {
              props.isSubscribtion ? null :
                <Select
                  title={'Sort by Task Type'}
                  value={state.sort}
                  name={'sort'}
                  options={state.options}
                  handleChange={handleChange}
                />
            }
          </div>
        </div>
      </div>

      <div className='row' style={{display: toggle ? 'block' : 'none'}}>
        <div className='col-12'>
          {
            props.transactions.length > 0 ?
              props.transactions.map((transaction, index) => {

                return(

                  <Transaction
                    key={index}
                    index={index}
                    transaction={transaction}
                  />

                )

              }) : null
          }
        </div>
      </div>

    </div>

  )

}

export default Transactions
