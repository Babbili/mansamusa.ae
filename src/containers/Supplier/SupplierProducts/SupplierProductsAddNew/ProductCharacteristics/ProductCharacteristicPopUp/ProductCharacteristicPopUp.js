import React, { useEffect, useState } from 'react'
import CharacteristicCart from './CharacteristicCart/CharacteristicCart'
import SignUpButton from '../../../../../../components/UI/SignUpButton/SignUpButton'
import ImagePicker from '../../../../../../components/ImagePicker/ImagePicker'

import styles from './ProductCharacteristicPopUp.module.scss'


const ProductCharacteristicPopUp = ({ uid, offers, offerIndex, isShow, setIsShow, setOfferIndex, characteristics, handleOffer }) => {

  const [state, setState] = useState(characteristics)
  const [images, setImages] = useState({
    productImages: []
  })
  const [val, setVal] = useState([])
  const [isValid, setIsValid] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setVal([])
  }, [])

  useEffect(() => {
    if (offers.length > 0 && offerIndex !== null) {
      let off = offers.filter((f, i) => i === offerIndex).map(m => m.options).flat(1)
      let img = offers.filter((f, i) => i === offerIndex).map(m => m.images).flat(1)
      setState(off)
      setImages({
        productImages: img
      })
    }
  }, [offers, offerIndex])

  const handleAddRow = (name) => {

    let newItem = {
      id: '',
      value: '',
      quantity: '',
      prefix: '',
      prefixOptions: [
        {
          id: 'minus',
          title: '-'
        },
        {
          id: 'plus',
          title: '+'
        }
      ],
      price: ''
    }

    let temp = state.map(f => {
      if (f.title === name) {
        f.items.push(newItem)
      }
      return f
    })

    setState(temp)

  }

  const handleRemoveRow = (name, rowIndex) => {

    setState(state.map(f => {

      if (f.title === name) {

        let oid = f.items.filter((f, index) => index === rowIndex)
        .map(m => m.id).toString()

        f.options.map(m => {
          if (m.id === oid) {
            delete m.selected
          }
          return null
        })

        f.items.splice(rowIndex, 1)

      }

      return f

    }))

  }

  const handleCharacteristics = event => {

    const { name } = event.target
    const id = event.target.children[event.target.selectedIndex].id
    const tabIndex = event.target.children[event.target.selectedIndex].tabIndex

    const optionObj = characteristics.filter(f => f.title.en === name)
    .map(m => m.options).flat(1).filter(f => f.id === id)
    .map(m => m.title)[0]

    setState(state.map(f => {
      if (f.title.en === name) {
        f.options.map(m => {
          if (m.id === id) {
            m.selected = true
          }
          return null
        })
        f.items.map((m, index) => {
          if (index === tabIndex) {
            m.id = id
            m.value = optionObj
          }
          return null
        })
      }
      return f
    }))

  }

  const handleCharacteristicsPrefix = event => {

    const { value, name } = event.target
    const tabIndex = event.target.children[event.target.selectedIndex].tabIndex

    setState(state.map(f => {
      if (f.title.en === name) {
        f.items.map((m, index) => {
          if (index === tabIndex) {
            m.prefix = value
          }
          return null
        })
      }
      return f
    }))

  }

  const handleCharacteristicsPrice = event => {

    const { value, name, id } = event.target

    setState(state.map(f => {
      if (f.title.en === name) {
        f.items.map((m, index) => {
          if (index === Number(id)) {
            m.price = value
          }
          return null
        })
      }
      return f
    }))

  }

  const handleCharacteristicsQuantity = event => {

    const { value, name, id } = event.target

    setState(state.map(f => {
      if (f.title.en === name) {
        f.items.map((m, index) => {
          if (index === Number(id)) {
            m.quantity = value
          }
          return null
        })
      }
      return f
    }))

  }

  const handleAdd = () => {
    if (isValid) {
      if (offers.length > 0 && offerIndex !== null) {
        let offer = {
          images: images.productImages,
          options: state
        }
        handleOffer(offer, offerIndex)
        setIsShow(!isShow)
      } else {
        let offer = {
          images: images.productImages,
          options: state
        }
        setIsShow(!isShow)
        handleOffer(offer)
        setState([])
      }
    } else {
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 1500)
    }
  }

  useEffect(() => {
    if (!val.some(s => s.value === false || s.quantity === false) || images.productImages.length > 0) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [val, images.productImages])

  useEffect(() => {

    setVal(prevState => {

      let prevVal = [...prevState]

      state.map((s, i) => {

        s.items.map((item, index) => {

          if (s.isMultiple) {

            if (item.value.length === 0 && item.quantity.length === 0) {

              let val = {option: i, item: index, value: false, quantity: false}

              if (!prevVal.some(s => s.option === val.option && s.item === val.item)) {
                prevVal = prevVal.concat(val)
              }

            } else {

              prevVal = prevVal.map(f => {
                if (f.option === i && f.item === index) {
                  f.value = item.value.length !== 0
                  f.quantity = item.quantity.length !== 0
                }
                return f
              })

            }

          } else {

            if (item.value.length === 0) {

              let val = {option: i, item: index, value: false}

              if (!prevVal.some(s => s.option === val.option && s.item === val.item)) {
                prevVal = prevVal.concat(val)
              }

            } else {

              prevVal = prevVal.map(f => {
                if (f.option === i && f.item === index) {
                  f.value = item.value.length !== 0
                }
                return f
              })

            }

          }

          return null

        })

        return null

      })

      return prevVal

    })

  }, [state])


  return(

    <div className={styles.ProductCharacteristicPopUp}>
      <div className={styles.wrapper}>

        <h3>Add Characteristics</h3>

        <div className={styles.inner}>

          <div className='row'>
            <div className='col-12 mb-3'>
              Please add different pictures best
              describes your product related to this
              characteristics please do so.
            </div>
            <div id='productImages' className='col-12 mb-3'>

              <ImagePicker
                uid={uid}
                state={images}
                isMultiple={true}
                setState={setImages}
                name={'productImages'}
              />

              {/*<FileInput*/}
              {/*  width={800}*/}
              {/*  height={1000}*/}
              {/*  ratio={'8:10'}*/}
              {/*  isCrop={true}*/}
              {/*  isMultiple={true}*/}
              {/*  isTransform={true}*/}
              {/*  images={productImages}*/}
              {/*  setImages={setProductImages}*/}
              {/*  title={isError && productImages.length === 0 ? `<div style="color: red">${ t('thisIsaMandatoryField.label') }</div>` : t('dragAndDrop.label') }*/}
              {/*  error={isError && productImages.length === 0}*/}
              {/*/>*/}

            </div>
          </div>

          <div className='row'>
            {
              state.length > 0 ?
                state.map((char, index) => {
                  return(
                    <div key={index} className='col-12'>
                      <CharacteristicCart
                        char={char}
                        isError={isError}
                        len={state.length}
                        handleAddRow={handleAddRow}
                        handleRemoveRow={handleRemoveRow}
                        handleChange={handleCharacteristics}
                        handleCharacteristicsPrice={handleCharacteristicsPrice}
                        handleCharacteristicsPrefix={handleCharacteristicsPrefix}
                        handleCharacteristicsQuantity={handleCharacteristicsQuantity}
                      />
                    </div>
                  )
                }) : null
            }
          </div>

          <div className='row mt-3'>
            <div className='col-6'>
              <SignUpButton
                title={`${offers.length > 0 && offerIndex !== null ? 'Update' : 'Add'}`}
                onClick={handleAdd}
                type={'custom'}
                disabled={false}
              />
            </div>
            <div className='col-6'>
              <SignUpButton
                title={'Cancel'}
                onClick={() => {
                  setIsShow(!isShow)
                  setOfferIndex(null)
                }}
                type={'custom'}
                disabled={false}
              />
            </div>
          </div>

        </div>
      </div>
    </div>

  )

}

export default ProductCharacteristicPopUp
