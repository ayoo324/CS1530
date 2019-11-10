var check = function() {
    if (document.getElementById('password').value ==
      document.getElementById('confirm_password').value) {
      
    } else {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = 'not matching';
    }
  }