import { Component } from 'react'
import { Link } from 'react-router'
import PlayLive from 'react-icons/lib/md/wifi-tethering'
import { RESTcallTo } from '../../filemaker/gameDataHelper'


class Thumb extends Component {
  constructor(props) {
    console.log(`>>>>>> Constructing Thumb class`)
    super(props)
    this.state = {
      label: ''
    }
  }

  /*    componentWillMount() {

      }*/

  /*  shouldComponentUpdate(nextProps) {
      console.log(`this thumb deckID should update? `, nextProps.tb.dID)
      return true
    }*/

  componentWillUpdate(nextProps) {
    console.log(`wil update thumb number ${nextProps.tb.dID}`)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`Did update thumb number ${prevProps.tb.dID}`)

    if (this.state.label == 'Game not live. Please check back.') {
      console.log(`time is limited!!!!!!`)
      setTimeout(() => {
        this.setState({ label: '' })

      }, 3000)
    }
  }


  render() {

    const { tb, liveBtnEvent } = this.props

    const btnClickEvent = (e) => {
      console.log(`live button is clicked at thumb: ${tb.dID}`)

      e.preventDefault()

      // Put live button event message on screen for that game thumbnail
      let labelText = `Checking game status...`
      this.setState({ label: labelText })
      RESTcallTo(`/getTheThumb/${tb.dID}`, thumb => {
        console.log(`---> thumbs downloaded at thumb id: ${tb.dID}`)
        console.log(thumb)
        const playID = thumb[0]['theDeckAllLivePlaysStatus::pID']
        if (playID) {
          this.setState({ label: '' })
          liveBtnEvent(playID, tb.dID)
        } else {
          this.setState({ label: `Game not live. Please check back.` })
        }
      })
    }

    return (
      <article className="thumb">
        <Link to={`/game/${tb.dID}`} className='anchor'>
                  <img src={tb.dThumbURL} alt={''}/>
        </Link>
        <h2 className="thumb-title">{tb._name}</h2>
        <div className='thumb-control'>
            <label>{this.state.label}</label>
            <a href='#' onClick={btnClickEvent} id={tb.dID} ><button className='liveButton'><PlayLive /></button></a>
        </div>
      </article>)
  }
}

export default Thumb
