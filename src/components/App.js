import Raact from 'react'
import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { ThumbSheet, PlayLiveLogIn } from './ui/deckAsset'
import PlayDeck from './ui/playDeck'
import { RESTcallTo } from '../filemaker/gameDataHelper'



class App extends Component {

  constructor(props, isOnLoad) {
    console.log(`>>>>>>constructor starts`)
    super(props)
    this.state = {
      thumbs: [],
      game: {
        deckID: null,
        // deckScreenStyle: { display: 'none' }
      },

      play: {
        id: null,
        deckID: null,
        logInScreenStyle: { display: 'none' },
        playData: {}

      }
    }

    this.isOnLoad = isOnLoad = false

    this.handleLiveLogIn = this.handleLiveLogIn.bind(this)
    this.handleDeckExit = this.handleDeckExit.bind(this)
    this.handleLogInExit = this.handleLogInExit.bind(this)
    this.liveGameUpdate = this.liveGameUpdate.bind(this)

  }

  componentWillMount() {
    console.log('>>>>>>Wil mount: ---> this.props', this.props)
    console.log('isOnLoad:', this.isOnLoad)

    this.isOnLoad = true
    console.log(`isOnLoad app data...`)

    RESTcallTo('/getThumbs', json => {
      console.log(`app data downloaded`)
      this.setState({
        thumbs: json
      })
      console.log(`exit the app data REST cb`)
    })
  }

  componentDidMount() {
    console.log('>>>>>>Did mount: ')
    console.log('isOnLoad:', this.isOnLoad)
    this.isOnLoad = false

  }

  componentWillReceiveProps(nextProps) {
    console.log(`>>>>>>Will receive props`, nextProps)
    if (nextProps.params.deckID) {
      let game = this.state.game
      game.deckID = nextProps.params.deckID
      this.setState(game)
      console.log('this.state:', this.state), 'this.isOnLoad', this.isOnLoad
    }
  }



  shouldComponentUpdate(nextProps, nextState) {
    console.log('>>>>>>should update?', nextProps, nextState)
    console.log('isOnLoad:', this.isOnLoad)

    return !this.isOnLoad
      // return true
      // return true
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('>>>>>>will update', nextProps, nextState)
    console.log('isOnLoad:', this.isOnLoad)

  }


  componentDidUpdate(prevProps, prevState) {
    this.isOnLoad = false
    console.log('>>>>>>Did update', prevProps, prevState)
    console.log('isOnLoad:', this.isOnLoad)
    const prevDeckID = prevState.game.deckID
    const prevLinkParams = prevProps.params.deckID
  }

  componentWillUnmount() {
    console.log(`>>>>>>Will unmount`)
  }

  handleLiveLogIn(playID, deckID) {
    console.log(`At handle liveLogIn`)

    let play = this.state.play

    play.id = playID
    play.deckID = deckID
    play.logInScreenStyle = { display: 'flex' }
    this.setState({ play: play })
  }

  handleLogInExit() {
    let play = this.state.play
    play.logInScreenStyle = { display: 'none' }
    this.setState({ play: play })
  }

  // start the game after getting the live play ID and the player ID
  liveGameUpdate(playData) {
    console.log(`At liveGameUpdate`)
    let play = this.state.play
    let game = this.state.game
    play.logInScreenStyle = { display: 'none' }
    play.playData = playData
    game.deckID = playData.pDeckID
    this.setState({ play, game })
  }

  handleDeckExit(playClosed) {
    console.log(`Deck exit is clicked: playClosed = `, playClosed)
    if (playClosed == true) {

      setTimeout(() => {
        console.log(`At App. Play Closed. Waiting to change state.`)
        this.setState({
          play: { id: null, logInScreenStyle: { display: 'none' }, playData: {} },
          // game: { deckID: null, deckScreenStyle: { display: 'none' } }
          game: { deckID: '' }
        })

      }, 5000)
    } else {
      this.setState({
        play: { id: null, logInScreenStyle: { display: 'none' }, playData: {} },
        // game: { deckID: null, deckScreenStyle: { display: 'none' } }
        game: { deckID: '' }
      })

    }

  }




  render() {

    const { thumbs } = this.state
      // const { deckID, deckScreenStyle } = this.state.game
    const { deckID } = this.state.game
    const { playData, logInScreenStyle } = this.state.play

    console.log(`render is called`)


    return (
      <div>

   <header className="masthead">
        <div className="sidebar-switcher">
            Select layout: <a href="#" className="sidebar-left-toggle">
            <i className="fa fa-align-left"></i>
            <span className="screen-reader-text">Move sidebar to the left</span>
            </a>
            <a href="#" className="sidebar-right-toggle">
            <i className="fa fa-align-right"></i><span className="screen-reader-text">Move sidebar to the right</span>
            </a>
            <a href="#" className="no-sidebar-toggle"><i className="fa fa-align-justify"></i><span className="screen-reader-text">Remove sidebar</span>
            </a>
            <a href="#" className="hide-sidebar-toggle"><i className="fa fa-arrow-circle-right"></i><span className="screen-reader-text">Remove sidebar</span>
            </a>
        </div>
        {/*//-- .sidebar-switcher -->*/}

        <div className="centered">
            <div className="site-branding">
                <h1 className="site-title">Your worldwide witty challenges start here.</h1>
            </div>
            {/*//-- .site-title -->*/}
        </div>
        {/*//-- .centered -->*/}


        {/*//-- .mixed-menu -->*/}

    </header>
     {/*.masthead -->*/}

    {/* play the deck */}

    {deckID ? <PlayDeck deckID={deckID}
                        livePlayLatestMoveData={playData}
                        // deckScreenStyle={deckScreenStyle}
                        IsClickedDeckExit={this.handleDeckExit}
                        handleDeckExit={this.handleDeckExit}/> : ''}

    {/* live log-in */}

    <PlayLiveLogIn
        logInScreenStyle={logInScreenStyle}
        thumbs={thumbs}
        handleLogInExit={this.handleLogInExit}
        play={this.state.play}
        liveGameDataCB={this.liveGameUpdate}/>

    <div className="content">
        <main className="main-area" >


            {/*//-- Deck Thumbnails -->*/}
                {(thumbs.length) ?
                  <ThumbSheet
                  thumbs={thumbs}
                  liveBtnEvent={this.handleLiveLogIn}/>
                  : <span>Nothing is loaded </span>
                }

        </main>


        {/*//-- .sidebar -->*/}
    </div>


    <footer className="footer-area">
        <p>World Intelligence Strategic Mind Systems. All rights reserved.</p>
    </footer>


      </div>
    )
  }
}

export default App
