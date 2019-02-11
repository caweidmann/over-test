import React, { Component } from 'react'
import axios from 'axios'
import './App.css'

const UNSPLASH = 'https://source.unsplash.com/random'
const DEFAULT_WIDTH = 150
const DEFAULT_HEIGHT = 150

class Search extends Component {
  state = {
    imageWidth: DEFAULT_WIDTH,
    imageHeight: DEFAULT_HEIGHT,
    currentSearch: {},
    searches: [],
    loading: false,
  }

  onFormSubmit = e => {
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
        // This could be its own component...
        <div className={this.state.loading ? 'current-search loading' : 'current-search'}>
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
        // This could be its own component...
        <div className="search-list">
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
      <main>
        <p>
          Type a search term, e.g. "nature" and hit enter to search. Optionally change the default width and height.
        </p>
        <div>
          {/* This could be its own component... */}
          <label htmlFor="width">Width</label>
          <input id="width" placeholder={DEFAULT_WIDTH} type="number" onChange={this.setWidth} />
          <label htmlFor="height">Height</label>
          <input id="height" placeholder={DEFAULT_HEIGHT} type="number" onChange={this.setHeight} />
        </div>
        <form onSubmit={this.onFormSubmit}>
          <input className="search-input" placeholder="Search..." ref={input => (this.searchInput = input)} />
          {loader}
        </form>
        {currentSearch}
        {searchList}
      </main>
    )
  }
}

export default Search
