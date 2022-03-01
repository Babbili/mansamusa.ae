import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchClient } from '../../../algolia/config'
import {
  InstantSearch,
  Configure,
  Index,
  // Hits,
  Highlight,
  // connectSearchBox,
} from 'react-instantsearch-dom'
import Autocomplete from './../Autocomplete/Autocomplete'


class SearchBar extends Component {

  state = {
    query: ''
  }

  onSuggestionSelected = (_, { suggestion }) => {

    this.setState({
      query: suggestion.title[this.props.lang]
    })

  }

  onSuggestionCleared = () => {

    this.setState({
      query: ''
    })

  }

  render() {

    return (

      <InstantSearch indexName="Products" searchClient={searchClient}>
        <Configure
            // filters="isApproved:true"
            hitsPerPage={3}
        />
        <Autocomplete
          lang={this.props.lang}
          class={this.props.class}
          placeholder={this.props.placeholder}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionCleared={this.onSuggestionCleared}
        />
        <Index indexName="Brands" />
      </InstantSearch>

    )
  }
}

function Hit(props) {

  return (
    <div>
      <Highlight attribute="title" hit={props.hit} />
      { props.hit.title.en }
    </div>
  )

}

Hit.propTypes = {
  hit: PropTypes.object.isRequired
}

export default SearchBar
