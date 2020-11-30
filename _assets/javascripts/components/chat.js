$(document).ready(function(){
  $('[data-trigger=chat]').click(function(e) {
    if(window.Intercom !== undefined) {
       window.Intercom('show')
    } else {
      window.location.href='/contactus/'
    }
    e.preventDefault()
  })
})