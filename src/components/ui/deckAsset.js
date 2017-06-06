import PropTypes from 'prop-types'
import React from 'react'
import PlayLive from 'react-icons/lib/md/wifi-tethering'
import Thumb from './thumb'
// import Card from './card'
import { RESTcallTo, RESTpostTo } from '../../filemaker/gameDataHelper'


// live log-in component

export const PlayLiveLogIn = ({ thumbs, play, logInScreenStyle, handleLogInExit, liveGameDataCB }) => {

  let _playerName
  const t = thumbs.filter((tb) => tb.dID == play.deckID)
  const deckName = t[0] ? t[0]._name : ''
  const submit = (e) => {
    e.preventDefault()
    const RESTpostData = {

      "data":[{
        "pDeckID": play.deckID,
        "_playerName": _playerName.value,
        "pID": play.id
      }]
    }
    // Create new player move in Filemkaer
    RESTpostTo('/postLiveGameData', RESTpostData, (json) => {
      console.log(`-------->  livePlayData downloaded: `, playData)
      // Got the live play ID and player ID from Filemaker
      const playData = json.data
      liveGameDataCB(playData[0])

      console.log(`Exiting from PlayLiveLogIn REST call. `)
    })
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div >
        <section className='logIn-container' style={logInScreenStyle}>
            <form onSubmit={submit} className="logIn-form"  >
            <h2>{deckName}</h2>
            <h1><PlayLive /></h1>
            <p>Ready to join the others to play this game live?</p>

              <label htmlFor="playerName">Enter your cool nickname here for the game.</label>
              <input id="playerName"
                   type="text"
                   required
                   defaultValue=''
                   ref={input => _playerName = input}
                   onFocus={handleFocus}/>

              <button>Join now!</button>
            </form>
        </section>
        <div className='deck-screen' style={logInScreenStyle}  onClick={handleLogInExit}>
        </div>
      </div>
  )
}

PlayLiveLogIn.defaultProps = {
  _playerName: "Mystic"
}

PlayLiveLogIn.propTypes = {
  _playerName: PropTypes.string.isRequired
}

// make thumbnail components for the ThumbSheet
// handle each thumb's user interactive

export const ThumbSheet = ({ thumbs, liveBtnEvent }) =>

  <section className='thumbSheet'>
    {thumbs.map( (tb, i) =>
            <Thumb
            key={i}
            liveBtnEvent={liveBtnEvent}
            tb={tb}/>
          )}
  </section>


