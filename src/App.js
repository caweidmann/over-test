import React, { Component } from 'react'
import axios from 'axios'

const UNSPLASH = 'https://source.unsplash.com/random'

class Search extends Component {
  state = {
    imageWidth: 100,
    imageHeight: 100,
    currentSearch: {},
    searches: [],
    loading: false,
  }

  formSubmit = e => {
    e.preventDefault()
    this.searchInput.disabled = true
    this.setState({ loading: true })
    const width = this.state.imageWidth
    const height = this.state.imageHeight
    axios.get(`${UNSPLASH}/${width}x${height}/?${this.searchInput.value}`).then(res => {
      const currentSearch = {
        id: Math.random(),
        query: this.searchInput.value,
        url: res.request.responseURL,
        width,
        height,
      }
      this.setState(previousState => ({
        currentSearch,
        searches: [...previousState.searches, currentSearch],
        loading: false,
      }))
      this.searchInput.disabled = false
      this.searchInput.value = ''
      this.searchInput.focus()
    })
  }

  setWidth = event => this.setState({ imageWidth: event.target.value })
  setHeight = event => this.setState({ imageHeight: event.target.value })
  updateCurrentSearch = search => this.setState({ currentSearch: search })
  removeFromList = id => this.setState({ searches: this.state.searches.filter(search => search.id !== id) })

  render() {
    let loader
    let currentSearch
    let searchList
    if (this.state.loading) {
      loader = <div>Hang tight...</div>
    }
    if (this.state.currentSearch.id) {
      currentSearch = (
        <div>
          <h3>Current search: {this.state.currentSearch.query}</h3>
          <img
            src={this.state.currentSearch.url}
            alt={this.state.currentSearch.query}
            width={this.state.currentSearch.width}
            height={this.state.currentSearch.height}
            ref="image"
          />
        </div>
      )
    }
    if (this.state.searches.length) {
      searchList = (
        <div>
          <h3>Your previous searches:</h3>
          <small>Click on a search term to see the image.</small>
          <ul>
            {this.state.searches.map(search => (
              <li key={search.id}>
                <span onClick={() => this.updateCurrentSearch(search)}>{search.query}</span>
                <button onClick={() => this.removeFromList(search.id)}>x</button>
              </li>
            ))}
          </ul>
        </div>
      )
    }
    return (
      <div>
        <div>Type a term, e.g. "nature" and hit enter to search. Optionally change the default width and height.</div>
        <label htmlFor="width">Width</label>
        <input id="width" placeholder="100" type="number" onChange={this.setWidth} />
        <label htmlFor="height">Height</label>
        <input id="height" placeholder="100" type="number" onChange={this.setHeight} />
        <form onSubmit={this.formSubmit}>
          <input placeholder="Search for..." ref={input => (this.searchInput = input)} />
          {loader}
        </form>
        <div>
          {currentSearch}
          {searchList}
        </div>
      </div>
    )
  }
}

export default Search
