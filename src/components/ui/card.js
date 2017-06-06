import { Component } from 'react'
import { RESTcallTo, RESTpostTo } from '../../filemaker/gameDataHelper'


class Card extends Component {

  constructor(props, moveOver, removeEffect, removePlayerMessage, ) {
    super(props)
    console.log(`>>>>>> Constructing Card`, props)
    this.state = {
      trackPlay: props.trackPlay,
      deckData: props.deckData,
      cardData: props.cardData,
      winnerDisplay: 'none',
      loserDisplay: 'none',
      cardDisplay: 'flex',
      cardOpacity: 1,
      disableButton: false,
      disableNextButton: true,
      playData: props.playData,
      liveNextButton: 'none',
      sideNoteColour: 'grey',
      sideNote: '',
      answerMessage: ''
    }

    this.moveOver = moveOver = false
    this.removeEffect = removeEffect = false
    this.removePlayerMessage = removePlayerMessage = false
    this.answerBtnClicked = this.answerBtnClicked.bind(this)
    this.nextBtnClicked = this.nextBtnClicked.bind(this)
    this.livePlayCardStatePrep = this.livePlayCardStatePrep.bind(this)
  }


  componentWillMount() {
    console.log(`>>>>>>Will mount card # ${this.state.cardData.cardNum}. this.state: `, this.state)

    if (this.state.playData.pID && !this.state.trackPlay.playClosed) {
      // it is a live play
      let myState = this.state
      myState = this.livePlayCardStatePrep(myState)

      this.setState({ myState })
    }
  }

  componentDidMount() {
    const { pID, _moveNum, pLatestMoveNum } = this.props.playData
    const { cardNum } = this.props.cardData

    if (pID && cardNum == pLatestMoveNum) { this.refs[cardNum].scrollIntoView({ block: 'start', behavior: 'smooth' }) }

  }

  /*  shouldComponentUpdate(nextProps) {
      console.log(`At card# ${this.state.cardData.cardNum}. Should update?`)
    }
  */
  /*  componentWillUpdate(nextProps) {

    }*/


  componentDidUpdate() {
      console.log('>>>>>>At card did update: ', this.moveOver)
      let myState = this.state
      if (this.removeEffect) {
        myState.cardDisplay = 'flex'
        myState.winnerDisplay = 'none'
        myState.loserDisplay = 'none'
        myState.disableButton = true
        myState.cardOpacity = .2
        myState = this.livePlayCardStatePrep(myState)

        this.removeEffect = false
        setTimeout(() => {
          console.log(`timer to remove card effect`, myState, `this.state `, this.state)
          this.setState({ myState })
        }, 3000)
      }
      if (this.removePlayerMessage) {
        this.removePlayerMessage = false
        myState.sideNote = `Player's name: ${this.state.playData._playerName}`
        myState.sideNoteColour = '#aaa'
        setTimeout(() => {
          console.log(`timer to remove Wating for next move message`, myState, `this.state `, this.state)
          this.setState({ myState })
        }, 3000)
      }
      if (this.state.trackPlay.playClosed && this.moveOver) {
        this.moveOver = false
        setTimeout(() => {
          console.log(`------> CB goes to playDec with trackPlay: `, this.state.trackPlay)
          this.props.handleFinalResult(this.state.trackPlay)
        }, 4000)
      }

    }
    // preparing which card to play during a live play
  livePlayCardStatePrep(myState) {

    const { pID, pLatestMoveNum, _playerRole, _playerName } = myState.playData
    const { cardNum, _question, _answer1, _answer2, _answer3, _answer4, _importURL, _correctAnswer, dWinnerURL, dLoserURL } = myState.cardData

    if (pID) {
      if (pLatestMoveNum) {
        if (pLatestMoveNum == 1 && cardNum == 1) {
          this.state.liveNextButton = this.moveOver ? 'block' : 'none'
          myState.cardOpacity = 1
          if (!this.removePlayerMessage) myState.sideNote = `Player's name: ${_playerName}`
          myState.trackPlay.totalMove = 0
        } else if (cardNum == pLatestMoveNum) {
          this.state.liveNextButton = this.moveOver ? 'block' : 'none'
          myState.cardOpacity = 1
          myState.trackPlay.totalMove = cardNum - 1 // subtruct 1 to wait for the answer click

          if (!this.removePlayerMessage) myState.sideNote = `Player's name: ${_playerName}`

        } else {
          myState.cardOpacity = .2
          myState.disableButton = true

        }

      } else if (cardNum == 1) {
        this.state.liveNextButton = this.moveOver ? 'block' : 'none'
        myState.cardOpacity = 1
        myState.trackPlay.totalMove = 0

        if (!this.removePlayerMessage) myState.sideNote = `Player's name: ${_playerName}`
      } else {
        myState.cardOpacity = .2
        myState.disableButton = true
        myState.trackPlay.totalMove = cardNum - 1 // subtruct 1 to wait for the answer

      }
    }
    return myState
  }

  answerBtnClicked(e) {

    e.preventDefault
    console.log(`Answer button is clicked`)
    const select = e.target.getAttribute('data-answer')
    const correctAnswer = e.currentTarget.getAttribute('data-correctAnswer')
    let myState = this.state
    let trackPlay = myState.trackPlay
    const { cardNum } = myState.cardData
    const deckData = myState.deckData
    const playData = this.state.playData
    const { pID, _playerName, pDeckID, playerID } = playData

    myState.cardDisplay = 'none'
    trackPlay.totalMove++

      if (select == correctAnswer) {
        myState.winnerDisplay = 'flex'
        myState.answerMessage = 'You are correct!'
        trackPlay.totalScore++
      } else {
        myState.loserDisplay = 'flex'
        myState.answerMessage = 'unh-unh...'
      }
    this.moveOver = true
    this.removeEffect = true


    // handle result and the final result
    console.log(`============> Handle last card: `, this.state)
    if (trackPlay.totalMove >= trackPlay.cardTotal) {
      trackPlay.playClosed = true
      trackPlay.resultDisplay = 'flex'
      const result = Math.round((trackPlay.totalScore / trackPlay.cardTotal) * 100)
      trackPlay.totalScoreMessage = `Your toal score is ${result}%`
      if (result > 59) {
        trackPlay.winner = true
        trackPlay.resultVisual = deckData[0].dWinnerURL
        trackPlay.finalMessage = deckData[0]._winnerMessage
        console.log(`============> Winner here! ${result}% ${trackPlay.finalMessage}`)
      } else {
        trackPlay.winner = false
        trackPlay.resultVisual = deckData[0].dLoserURL
        trackPlay.finalMessage = deckData[0]._loserMessage
        console.log(`============> Loser here! ${result}% ${trackPlay.finalMessage}`)
      }
    }

    // send trackPlay data back to playDeck



    // handle the live play. pID = there is a Live Play ID

    if (pID) {
      console.log(`=======> this.state.playData: `, this.state.playData)
      const RESTpostData = {

        "data": [{
          "pDeckID": pDeckID,
          "_playerName": _playerName,
          "pID": pID,
          "playerID": playerID,
          "_moveNum": cardNum,
          "_moveScore": myState.winnerDisplay == 'flex' ? 1 : 0
        }]
      }
      const keyValue = `${pID}_${playerID}_${cardNum}`
      const encodedURi = encodeURIComponent(`setkeyPlayerIDforTheLiveMove===${keyValue}`)
        // console.log(`encodedURi ${encodedURi}`)
      const url = `/putLiveGameData/${encodedURi}`
        // const url = `/putLiveGameData/setkeyPlayerIDforTheLiveMove===${keyValue}`
      console.log(`------> Sending score to Filemaker`, RESTpostData)
        // Create the new player move or update the first move.
      RESTpostTo(url, RESTpostData, (json) => {
        console.log(`------> Move score updated: `, json)
        if (json.info['X-RESTfm-Status'] == 200) {
          myState.disableNextButton = false
          myState.playData = playData
          this.setState({ myState })
        } else {
          console.log(`!!!!!!Something went wrong :-(  :-(  :-(`)
        }
      })

    } else {
      this.setState({ myState })

    }

  }

  nextBtnClicked(e) {
    e.preventDefault
    console.log(`Next button is clicked. this.state: `, this.state)
    const { cardNum } = this.state.cardData
    const { pID, _moveNum } = this.state.playData
    let myState = this.state

    if (pID) {
      RESTcallTo(`/getTheLivePlayLatestMove/${pID}`, json => {
        console.log(`------> Live play data downloaded`, json)
        const pLatestMoveNum = json[0][`theLivePlayLeaderDescMove::pLatestMoveNum`]
        if (pLatestMoveNum <= cardNum) {
          myState.sideNote = `Still waiting. Try again in a bit.`
          myState.sideNoteColour = 'blue'
          this.removePlayerMessage = true
          this.setState({ myState })
        } else if (pLatestMoveNum > cardNum) {
          let playData = this.state.playData
            // update playData, send it to playDeck component to update the deck
          playData.pLatestMoveNum = pLatestMoveNum
          playData._moveNum = pLatestMoveNum
          this.props.handleNextButton(playData)
        }

      })
    }
  }


  render() {
    const { cardData, deckData, winnerDisplay, loserDisplay, cardDisplay, cardOpacity, disableButton, liveNextButton, disableNextButton, sideNote, sideNoteColour } = this.state
    const { cardNum, _question, _answer1, _answer2, _answer3, _answer4, _importURL, _correctAnswer, dWinnerURL, dLoserURL } = cardData
    const { pID, pLatestMoveNum, _playerRole, _playerName } = this.state.playData
    const deckDataLength = deckData.length

    console.log(`Rendering card #${cardNum}`, this.state)

    let answerKey = `_answer${_correctAnswer}`

    let btnText = ['select', 'select', 'select', 'select']
    if (this.moveOver) {
      btnText = btnText.map((btn, i) => (i + 1) == _correctAnswer ? 'Correct Answer' : 'Select')
    }

    let winner = <article className='effect' style={{display: winnerDisplay}}>
                      <div className='resultEffect'>
                          <img src={dWinnerURL} alt='' />
                      </div>
                      <div className='resultText'>
                          <h2>{this.state.answerMessage}</h2>

                      </div>
                  </article>

    let loser = <article className='effect' style={{display: loserDisplay}}>
                    <picture className='resultEffect'>
                        <img src={dLoserURL} alt='' />
                    </picture>
                    <div className='resultText'>
                        <h2>{this.state.answerMessage}</h2>
                        <p>The correct answer is: {cardData[answerKey]}</p>
                    </div>
                </article>

    let Q_n_A =

      <article  style={{display: cardDisplay}}>
                <div className='question'>
                    <h3>{`${cardNum}. ${cardData._question}`}</h3>
                </div>
                <div className='cardContent'>
                    <picture className='visual'>
                        <img src={_importURL} alt='' />
                    </picture>
                    <div className='answers-container'>
                          <div className='answer-row' >
                              <h4 className='answer'>{_answer1} </h4>
                              <button data-correctAnswer={_correctAnswer} disabled={disableButton} data-answer='1' onClick={this.answerBtnClicked}>{btnText[0]}</button>
                          </div>
                          <div className='answer-row'>
                              <h4 className='answer'>{_answer2}</h4>
                              <button data-correctAnswer={_correctAnswer} disabled={disableButton} data-answer='2' onClick={this.answerBtnClicked}>{btnText[1]}</button>
                          </div>
                          <div className='answer-row'>
                              <h4 className='answer'>{_answer3}</h4>
                              <button data-correctAnswer={_correctAnswer} disabled={disableButton} data-answer='3' onClick={this.answerBtnClicked}>{btnText[2]}</button>
                          </div>
                          <div className='answer-row'>
                              <h4 className='answer'>{_answer4}</h4>
                              <button data-correctAnswer={_correctAnswer} disabled={disableButton} data-answer='4' onClick={this.answerBtnClicked}>{btnText[3]}</button>
                          </div>
                          <div className='answer-row'>
                              <p className='answer' style={{color: sideNoteColour}} >{sideNote}</p>
                              <button className='next-btn' style={{display: liveNextButton}} disabled={disableNextButton} onClick={this.nextBtnClicked}>Next</button>
                          </div>

                      </div> {/*end of q_n_a*/}
                </div>
             </article>



    return (
      <div className='card' style={{opacity: cardOpacity}} ref={cardNum}>
        {winner}
        {loser}
        {Q_n_A}

      </div>)
  }
}

export default Card
