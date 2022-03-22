import React, { Component } from 'react'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import PropTypes from 'prop-types'
import ProductItem from '../../ProductItem/ProductItem'
import styles from './Cinfinite.module.scss'


class CustomInfiniteHits extends Component {

  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
  }

  sentinel = null

  onSentinelIntersection = entries => {
    const { hasMore, refine } = this.props

    entries.forEach(entry => {
      if (entry.isIntersecting && hasMore) {
        refine()
      }
    })
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(this.onSentinelIntersection)

    this.observer.observe(this.sentinel)
  }

  componentWillUnmount() {
    this.observer.disconnect()
  }

  render() {

    const { hits } = this.props

    return (

      <div className={styles.products__container}>
        {
          hits.map(hit => (
            <ProductItem
              key={hit.objectID}
              mb={'mb-5'}
              product={hit}
            />
          ))
        }
        <div
          className={'col-lg-3 col-12'}
          ref={c => (this.sentinel = c)}
        />
      </div>

    )
  }
}

export default connectInfiniteHits(CustomInfiniteHits)
