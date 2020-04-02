"use strict";

var token;

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
};

var DomoForm = function DomoForm(props) {
  return (
    /*#__PURE__*/
    React.createElement("form", {
      id: "domoForm",
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm",
      onSubmit: handleDomo
    },
    /*#__PURE__*/
    React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "name"
    }, "Name: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "age"
    }, "Age: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }),
    /*#__PURE__*/
    React.createElement("label", {
      htmlFor: "favoriteColor"
    }, "Favorite Color: "),
    /*#__PURE__*/
    React.createElement("input", {
      id: "domoColor",
      type: "text",
      name: "color",
      placeholder: "Domo Color"
    }),
    /*#__PURE__*/
    React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (
      /*#__PURE__*/
      React.createElement("div", {
        className: "domoList"
      },
      /*#__PURE__*/
      React.createElement("h3", {
        "class": "emptyDomo"
      }, "No Domos Yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return (
      /*#__PURE__*/
      React.createElement("div", {
        key: domo._id,
        className: "domo"
      },
      /*#__PURE__*/
      React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }),
      /*#__PURE__*/
      React.createElement("h3", {
        className: "domoName"
      }, "Name: ", domo.name),
      /*#__PURE__*/
      React.createElement("h3", {
        className: "domoAge"
      }, "Age: ", domo.age),
      /*#__PURE__*/
      React.createElement("h3", {
        className: "domoColor"
      }, "Favorite Color: ", domo.color),
      /*#__PURE__*/
      React.createElement("button", {
        key: domo._id,
        onClick: function onClick() {
          return props.deleteDomo(domo._id);
        },
        className: "domoDelete"
      }, "Delete"))
    );
  });
  return (
    /*#__PURE__*/
    React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var deleteDomo = function deleteDomo(id) {
  //needs the token for the request
  var delData = {
    id: id,
    _csrf: token
  };
  sendAjax('DELETE', '/deleteDomo', delData, function (data) {
    //we deleted, display the domo which is ironically handle error
    //refresh the list
    handleError(data.message);
    loadDomosFromServer();
  });
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(
    /*#__PURE__*/
    React.createElement(DomoList, {
      domos: data.domos,
      deleteDomo: deleteDomo,
      csrf: token
    }), document.querySelector('#domos'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(
  /*#__PURE__*/
  React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector('#makeDomo'));
  ReactDOM.render(
  /*#__PURE__*/
  React.createElement(DomoList, {
    domos: [],
    deleteDomo: deleteDomo,
    csrf: csrf
  }), document.querySelector('#domos'));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (res) {
    setup(res.csrfToken);
    token = res.csrfToken;
  });
};

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
