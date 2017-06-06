import { Component } from 'react'
import Card from './card'
import { RESTcallTo } from '../../filemaker/gameDataHelper'

class PlayDeck extends Component {

  constructor(props, dontUpdate) {
    super(props)
    console.log(`>>>>>> Constructing PlayDeck class`, props)
    this.state = {
      playData: props.livePlayLatestMoveData,
      pLatestMoveNum: null,
      game: { deckID: props.deckID },
      deckScreenStyle: 'none',
      deckData: [],
      trackPlay: {
        playClosed: false,
        resultDisplay: 'none'
      } //prevent re-rendering the cards until the last move

    }
    this.dontUpdate = dontUpdate = false
    this.loadTheDeck = this.loadTheDeck.bind(this)
    this.handleNextButton = this.handleNextButton.bind(this)
    this.handleFinalResult = this.handleFinalResult.bind(this)

  }

  componentWillMount() {
    const loadDeck = this.loadTheDeck(this.state.game.deckID)
    this.dontUpdate = true
    loadDeck.then(text => console.log(text))
  }

  componentDidMount() {
    console.log('>>>>>>Did mount PlayDeck: ')
    console.log(`dontUpdate: ${this.dontUpdate}`)
    this.dontUpdate = false

  }

  shouldComponentUpdate(nextProps) {
    console.log(`play Deck should update? ${this.dontUpdate}`)
    return !this.dontUpdate
  }


  componentWillUpdate(nextProps) {
    console.log(`Will Update at playDeck`)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`>>>>>>Did update playDeck`)
    this.dontUpdate = false
    if (prevState.trackPlay.playClosed) {
      this.refs.result.scrollIntoView({ block: 'start', behavior: 'smooth' })


        this.props.handleDeckExit(this.state.trackPlay.playClosed)

        console.log(`------> Exiting the playDeck. Going to the App`)

    }
  }

  componentWillUnmount() {
    console.log(`>>>>>>Will unmount PlayDeck`)
  }


  loadTheDeck(deckID) {
    console.log(`Promising to LoadTheDecK`)

    return new Promise((resolve, reject) => {
      const url = `/getTheGame/${deckID}`
      RESTcallTo(url, deckData => {
          console.log(`------> Game data downloaded`)
          let thisState = this.state
          thisState.deckScreenStyle = 'flex'
          thisState.deckData = deckData
          thisState.trackPlay.cardTotal = deckData.length
          thisState.trackPlay.totalMove = 0
          thisState.trackPlay.totalScore = 0
          this.setState(thisState)
          console.log(`exiting the game data download cb`)
          resolve('the promise is working! :-)')
        }) // end of RESTcallTo
    })

  }

  handleNextButton(playData) {
    let myState = this.state
    myState.playData = playData
    myState.pLatestMoveNum = playData.pLatestMoveNum
    this.setState(myState)
      // use pLatestMoveNum to force re-render during live play after the next button
    this.setState({ key: myState.pLatestMoveNum })
    console.log(`At handleNextButton: `, this.state)
  }

  handleFinalResult(trackPlay) {
    const deckData = this.state.deckData

    if (trackPlay.playClosed) {
      let myState = this.state
      myState.trackPlay = trackPlay

      this.setState(myState)
    }
  }

  render() {

    console.log(`>>>>>>Rendering cards: `, this.state)

    const { deckID } = this.state.game
    const { deckScreenStyle, deckData, playData, trackPlay } = this.state
    const { resultDisplay, playClosed, resultVisual, totalScoreMessage, finalMessage } = this.state.trackPlay


    let result = <div className='card' style={{display: resultDisplay}} ref='result'>
                    <div className='effect'  >
                          <picture className='resultEffect'>
                              <img src={resultVisual} alt='' />
                          </picture>
                          <div className='resultText'>
                              <h2>{totalScoreMessage}</h2>
                              <p>{finalMessage}</p>
                          </div>
                    </div>
                </div>
    return (

      /* use pLatestMoveNum to force re-render during live play after the next button*/
      <div key={this.state.pLatestMoveNum} id='removeTheDeck'>

                 <section className='deck' style={{display: deckScreenStyle}} >
                     {deckData[0] ?   deckData.map(( card, i ) =>
                      <Card key={i}
                            playData={playData}
                            deckData={deckData}
                            pLatestMoveNum={this.state.pLatestMoveNum}
                            cardData={card}
                            handleNextButton={this.handleNextButton}
                            trackPlay={trackPlay}
                            handleFinalResult={this.handleFinalResult} />) : ''}
                     {result}
                  </section>

        <div className='deck-screen' style={{display: deckScreenStyle}}  onClick={this.props.IsClickedDeckExit}>
        </div>
    </div>
    )
  }
}

export default PlayDeck
