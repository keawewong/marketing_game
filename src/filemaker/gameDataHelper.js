export const RESTcallTo = (url, cb) => {

  fetch(url).then(response => response.json()).then(json => cb(json))

}


export const RESTpostTo = (url, data, cb) => {

  data = JSON.stringify(data)

  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  }).then(response => response.json()).then(json => cb(json)).catch(err => console.log(err));


}

