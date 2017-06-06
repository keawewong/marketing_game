const fetch = require("isomorphic-fetch")

// const user = 'wittyDeveloper'
// const pin = 'YearOfTheCh!cken2017'
// const RESTfm = `https://52.27.5.199/RESTfm/witty/`
const user = process.env.FMS_USER
const pin = process.env.FMS_USER_PIN
const RESTfm = process.env.RESTfm
const base64encodedData = new Buffer(user + ':' + pin).toString('base64')

module.exports = {

  RESTfmGet: (scriptName = '', layout = '', params = '', cb) => {

    !params ? params = '' : params = `?RFMscriptParam=${params}`

    let url = `${RESTfm}script/${scriptName}/${layout}.json${params}`
    console.log(`url: ${url}`)


    let request = new Request(url, {
      method: 'get',
      headers: new Headers({
        'Authorization': 'Basic ' + base64encodedData
      })
    })
    fetch(request).then(response => response.json()).then(json => {
      console.log(`Get data: `, json)
      cb(json.data)})
  },


  RESTfmPost: (data, method, scriptName = '', layout = '', key='', scriptParams = '', cb) => {

    !key ? key = '' : key = encodeURIComponent(`/${key}`)
    // !key ? key = '' : key = `/${key}`

    const elsePost = (method == 'put' ? `RFMelsePOST&RFMscript=${scriptName}` : '')

method == 'post' ? scriptName = `RFMscript=${scriptName}` : scriptName = ''

    !scriptParams ? scriptParams = '' : scriptParams = `&RFMscriptParam=${scriptParams}`


    const uri = `${key}.json?${elsePost}${scriptName}${scriptParams}`

    let url = `${RESTfm}layout/${layout}${uri}`
    console.log(`url: ---${url}---`)

    data = JSON.stringify(data)

    let request = new Request(url, {
      method: method,
      headers: new Headers({
        'Authorization': 'Basic ' + base64encodedData,
      }),
      body: data
    })

    fetch(request ).then(response => response.json()).then(json => {
console.log(`post or put data: `, json)
      cb(json)})

  }

}
