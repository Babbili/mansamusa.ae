import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  connectAutoComplete
} from 'react-instantsearch-dom'
import AutoSuggest from 'react-autosuggest'
import { Link } from 'react-router-dom'
import { toSlug } from '../../utils/toSlug'

import './theme.scss'


class AutoComplete extends Component {

  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionCleared: PropTypes.func.isRequired
  }

  state = {
    value: this.props.currentRefinement
  }

  onChange = (_, { newValue }) => {

    if (!newValue) {
      this.props.onSuggestionCleared()
    }

    this.setState({
      value: newValue,
    })

  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value)
  }

  onSuggestionsClearRequested = () => {
    this.props.refine()
  }

  getSuggestionValue(hit) {
    return typeof hit.title === 'object' ? hit.title.en : hit.title
  }

  renderSectionTitle(section) {
    return section.index
  }

  getSectionSuggestions(section) {
    return section.hits
  }

  renderSuggestion(hit) {

    let url = hit.productPrice !== undefined ?
      '/details' + toSlug(hit.title.en) + '-' + hit.objectID :
      '/store/' + hit.objectID


    return (

      <div className='hitContainer'>
        <Link to={url}>
          <div className='wrapper'>
            <div
              className='img'
              style={{
                backgroundImage: `url(${hit.image})`
              }}
            />
            <div className='textWrapper'>
              <div className='title'>
                {
                  typeof hit.title === 'object' ?
                    hit.title.en : hit.title
                }
              </div>
              <div className='description'>
                {
                  typeof hit.description === 'object' ?
                    hit.description.en.slice(0, 100) + '...' : hit.description
                }
              </div>
            </div>
          </div>
          {
            hit.price !== undefined ?
              <div className='price'>
                <div className='currency'>
                  AED
                </div>
                { hit.price }
              </div> : null
          }
        </Link>
      </div>
    )
    // return <Highlight attribute="title" hit={hit} tagName="mark" />;
  }

  render() {

    const { hits, onSuggestionSelected } = this.props
    const { value } = this.state

    const inputProps = {
      placeholder: this.props.placeholder,
      onChange: this.onChange,
      value,
      className: this.props.class
    }


    return (

      <AutoSuggest
        suggestions={hits}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        multiSection={true}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
      />

    )
  }
}

export default connectAutoComplete(AutoComplete)
