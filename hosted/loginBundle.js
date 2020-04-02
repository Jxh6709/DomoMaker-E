"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (
    /*#__PURE__*/
    React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      action: "/login",
      method: "POST",
      className: "mainForm",
      onSubmit: handleLogin
    },
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "username"
    }, "Username: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }),
    /*#__PURE__*/
    React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }),
    /*#__PURE__*/
    React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign In"
    }))
  );
};

var SignupWindow = function SignupWindow(props) {
  return (
    /*#__PURE__*/
    React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      action: "/signup",
      method: "POST",
      className: "mainForm",
      onSubmit: handleSignup
    },
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "username"
    }, "Username: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "pass2"
    }, "Password: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }),
    /*#__PURE__*/
    React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }),
    /*#__PURE__*/
    React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign Up"
    }))
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(
  /*#__PURE__*/
  React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(
  /*#__PURE__*/
  React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');
  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //default
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (res) {
    setup(res.csrfToken);
  });
}; //let's go


$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  console.log("".concat(type, " ").concat(action, " ").concat(data, " "));
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
