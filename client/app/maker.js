let token;

const handleDomo = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    sendAjax('POST',$("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer();
    });
};

const DomoForm = (props) => {
    return (
        <form id="domoForm" name="domoForm" action="/maker" method="POST" className="domoForm" onSubmit={handleDomo}>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="favoriteColor">Favorite Color: </label>
            <input id="domoColor" type = "text" name="color" placeholder="Domo Color"/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
          </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 class="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map((domo) => { 
        return (
            <div key={domo._id} className = "domo">
                <img src = "/assets/img/domoface.jpeg" alt="domo face" className = "domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoColor">Favorite Color: {domo.color}</h3>
                <button key={domo._id} onClick={() => props.deleteDomo(domo._id)} className="domoDelete">Delete</button>
            </div>
        );
    });
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const deleteDomo = (id) => {
    //needs the token for the request
    let delData = {
        id: id,
        _csrf: token
    }
    sendAjax('DELETE', '/deleteDomo', delData, (data) => {
        //we deleted, display the domo which is ironically handle error
        //refresh the list
        handleError(data.message);
        loadDomosFromServer();
    });
};

const loadDomosFromServer = () => {
    sendAjax('GET','/getDomos',null, (data)=> {
        ReactDOM.render(
            <DomoList domos={data.domos} deleteDomo={deleteDomo} csrf={token}/>,
            document.querySelector('#domos')
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} deleteDomo={deleteDomo} csrf={csrf} />, document.querySelector('#domos')
    );
    loadDomosFromServer();
};
const getToken = () => {
    sendAjax('GET','/getToken',null, (res) => {
        setup(res.csrfToken);
        token = res.csrfToken;
    });
};

$(document).ready(() => {
    getToken();
});