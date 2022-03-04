import React from 'react'
import Select from '../../../../../components/UI/Select/Select'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'


const CategoriesSelector = ({ lang, hide, state, handleClear, handleChange, error, text }) => {

  let { t } = useTranslation()

  return(

    <>

      <div className='col-12 p-0'>
        {
          state.categoryPicker.categorySelectors.map((category, index) => {
            return(
              <div key={index} className='col-12'>
                <Select
                  lang={lang}
                  name={category}
                  options={state.categoryPicker[`${category}Options`]}
                  value={state.categoryPicker[`${category}`]}
                  handleChange={handleChange}
                  title={ t('chooseCategory.label') }
                  deactivate={state.categoryPicker[`${category}`]}
                  error={state.categoryPicker.categorySelectors.length - 1 === index ? error : ''}
                  text={state.categoryPicker.categorySelectors.length - 1 === index ? text : undefined}
                />
              </div>
            )
          })
        }
      </div>
      {
        state.categoryPicker.productCategories.length > 0 ?
          hide ? null :
          <div className='col-9 p-0 mt-3'>
            <SignUpButton
              title={'Clear'}
              type={'custom'}
              onClick={handleClear}
              disabled={false}
            />
          </div> : null
      }

    </>

  )

}

export default CategoriesSelector
