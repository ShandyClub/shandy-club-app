import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import uuid from 'node-uuid'
import Transition from 'react-addons-css-transition-group'

// actions
import * as actions from './actions'
import { actions as uiActions } from '../ui'

// selectors
import selectors from './selectors'

// components
import { Anchor } from 'components/anchor'
import { Button } from 'components/button'
import { Icon } from 'components/icon'
import { Image } from 'components/image'
import { Input } from 'components/input'
import { View } from 'components/layout'
import { List } from 'components/list'
import { Section } from 'components/section'
import { Text } from 'components/text'
import Map from 'components/map'

// constants
import { MAP_OPTIONS, MAP_TILE_URL, MAP_TILE_OPTIONS, ZOOM_CONTROL_OPTIONS } from 'constants'

export class Search extends Component {

  constructor() {

    super()

    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.toggleClickOutsideEvent = this.toggleClickOutsideEvent.bind(this)
    this.toggleFeatures = this.toggleFeatures.bind(this)
    this.toggleInputFocus = this.toggleInputFocus.bind(this)
    this.onPubCloseClick = this.onPubCloseClick.bind(this)
    this.onPubPrevClick = this.onPubPrevClick.bind(this)
    this.onPubNextClick = this.onPubNextClick.bind(this)

  }

  componentDidUpdate(prevProps) {

    const { isSearchFocused } = this.props
    const { isSearchFocused: prevIsSearchFocused } = prevProps

    // check whether suggestions is newly opened || newly closed
    if (isSearchFocused !== prevIsSearchFocused) this.toggleClickOutsideEvent(isSearchFocused)

  }

  componentWillUnmount() {

    const { handleClickOutside } = this

    // stop listening for clicks outside
    window.removeEventListener('click', handleClickOutside)

    // reset UI state
    handleClickOutside()

  }

  toggleClickOutsideEvent(enabled) {

    // listen for clicks outside || stop listening for clicks outside
    const listener = enabled ? window.addEventListener : window.removeEventListener

    listener('click', this.handleClickOutside)

  }

  handleClickOutside() {

    this.toggleInputFocus(false)

  }

  toggleFeatures() {

    const { isSearchFeatures, actions: { updateUI } } = this.props

    updateUI({ search: { features: !isSearchFeatures } })

  }

  toggleInputFocus(focus=true) {

    const { updateUI } = this.props.actions

    updateUI({ search: { focus } })

  }

  onPubCloseClick() {

    const { actions: { setSelectedResult } } = this.props

    // reset selectedResult to default
    setSelectedResult()

  }

  onPubPrevClick() {

    const { actions: { setSelectedResult }, selectedResultIndex, totalResults } = this.props

    const prevIndex = selectedResultIndex <= 0 ? totalResults - 1 : selectedResultIndex - 1

    setSelectedResult(prevIndex)

  }

  onPubNextClick() {

    const { actions: { setSelectedResult }, selectedResultIndex, totalResults } = this.props

    const nextIndex = selectedResultIndex >= totalResults - 1 ? 0 : selectedResultIndex + 1

    setSelectedResult(nextIndex)

  }

  render() {

    const { actions, geocodes, geolocation, point, mapMarkers, term, isPanelOpen, isSearchFitToBounds, isSearchOverlayed, selectedResult, selectedResultIndex, showSuggestions } = this.props
    const { getGeocode, setGeocode, clearGeocode, getGeolocation, setPoint, setSelectedResult } = actions

    const { toggleInputFocus, onPubCloseClick, onPubPrevClick, onPubNextClick } = this

    // const renderFeaturesToggle = !isSearchOverlayed ? (
    //   <Button onClick={toggleFeatures}>toggle features</Button>
    // ) : null

    return (
      <View atomic={{ pt: isSearchOverlayed ? 14 : 0 }}>

        <Image src='shandy-club.png' width='50px' height='50px' center atomic={ !isSearchOverlayed ? { po:'a', t:1, l:1, z:1 } : null } />

        { isSearchOverlayed ? (
          <Section>

            <Text atomic={{ fs:7, ta:'c', tt:'u' }} fontStack='secondary' letterSpacing='3px'>
              Shandy Club
            </Text>

            <Text atomic={{ fs:5, ta:'c' }}>

              Fancy a pint? Silly question.<br/>
              So, where to?<br/>
              Now that’s a little tougher.<br/>

              <Anchor onClick={getGeolocation}>
                Luckily we know a few nearby
              </Anchor>

            </Text>

            <Text atomic={{ fs:5, ta:'c' }}>

              But maybe you’re a savvy old sort<br/>
              planning a trip to

              <Input
                autoFocus
                type='text'
                placeholder='Islington'
                width='100px'
                atomic={{ ml:1, mr:1 }}
                value={ term || '' }
                innerRef={ r => Search._input = r }
                onChange={ () => Search._input.value ? getGeocode(Search._input.value) : clearGeocode() }
                onFocus={ () => toggleInputFocus() }
                onClick={ e => e.stopPropagation() } />

            </Text>

            { showSuggestions ? (
              <List maxWidth='600px' maxHeight='144px'>
                { geocodes.map( g => (
                  <div key={uuid.v4()} onClick={ () => setGeocode(g.get('center'), g.get('place_name')) }>
                    { g.get('place_name') }
                  </div>
                )) }
              </List>
            ) : null }

          </Section>
        ) : null }

        {/* { renderFeaturesToggle } */}

        {/* { isSearchFeatures ? (
          <List>
            { features.keySeq().map( f => (
              <div key={uuid.v4()} className={ features.get(f) ? 'TODO active' : 'TODO normal' } onClick={ () => toggleFeature(f) }>{ f }</div>
            )) }
          </List>
        ) : null } */}

        { !isSearchOverlayed ? (
          <Map
            center={point}
            fitToBounds={isSearchFitToBounds}
            geolocation={geolocation}
            markers={mapMarkers}
            mapOptions={MAP_OPTIONS}
            selectedResultIndex={selectedResultIndex}
            tileOptions={MAP_TILE_OPTIONS}
            tileURL={MAP_TILE_URL}
            zoomControlOptions={ZOOM_CONTROL_OPTIONS}
            setPoint={setPoint}
            setSelectedResult={setSelectedResult} />
        ) : null }

        <Transition transitionName='slide-left' transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          { !isSearchOverlayed && isPanelOpen ? (
            <Section atomic={{ p:4, po:'f', t:0, r:0 }} width='300px' height='100%' backgroundColor='light' style={{ boxShadow: '-4px 0 20px 0 rgba(0, 0, 0, 0.2)' }}>

              <Button onClick={ () => onPubCloseClick() }>
                <Icon>close</Icon>
              </Button>

              <Text atomic={{ fs:6, mb:1, ta:'c', tt:'u' }} fontStack='secondary' letterSpacing='2px'>
                { selectedResult.name }
              </Text>

              <Text atomic={{ fs:3, mt:0, ta:'c' }}>
                { selectedResult.address } { selectedResult.postcode }
              </Text>

              <Text atomic={{ fs:5, ta:'c' }}>
                { selectedResult.desc }
              </Text>

              { selectedResult.features.keySeq().map( f => selectedResult.features.get(f) ? (
                <Text key={uuid.v4()} atomic={{ d:'ib', fs:3, fw:'b', mt:0, mr:1, mb:0, ml:1, td:'o', tt:'u' }}>{ f }</Text>
              ) : null ) }

              <Button atomic={{ po:'a', b:4, l:4 }} onClick={ () => onPubPrevClick() }>
                <Icon>chevron_left</Icon>
                <Text atomic={{ d:'ib', fs:3, m:0, tt:'u' }}>Prev</Text>
              </Button>

              <Button atomic={{ po:'a', b:4, r:4 }} onClick={ () => onPubNextClick() }>
                <Text atomic={{ d:'ib', fs:3, m:0, tt:'u' }}>Next</Text>
                <Icon>chevron_right</Icon>
              </Button>

            </Section>
          ) : null }
        </Transition>

      </View>
    )

  }

}

export default connect(
  createStructuredSelector({ ...selectors }),
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...uiActions }, dispatch)
  })
)(Search)
