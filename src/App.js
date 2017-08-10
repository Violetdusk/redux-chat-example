import React, { Component } from 'react';
import './App.css';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

const store = createStore(chattingApp);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <ChatBox />
          <InputBox />
        </div>
      </Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    send: (text) => dispatch(sendMessage(text))
  });
}

class _InputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <div className="chat-input">
        <input value={this.state.text} onChange={(e) => this.setState({ text: e.target.value })} type="text" />
        <button onClick={this.handleOnClick.bind(this)}>
          Send
        </button>
      </div>
    )
  }

  handleOnClick() {
    this.props.send(this.state.text);
    this.setState({ text: '' });
  }
}
const InputBox = connect(undefined, mapDispatchToProps)(_InputBox);

const mapStateToProps = (state) => {
  return ({
    chatData: state.chatData
  })
};

class _ChatBox extends Component {
  render() {
    return (
      <div className="chat-box">
        {
          Object.keys(this.props.chatData).map(v => (<ChatLine chatline={this.props.chatData[v]} />))
        }
      </div>
    )
  }
}

const ChatBox = connect(mapStateToProps)(_ChatBox);

const ChatLine = ({ chatline }) => (<div>{chatline.writer} | {chatline.content} </div>);

export default App;


/**
 * Redux actions
 */
const SEND_MESSAGE = 'SEND_MESSAGE';

/**
 * sendMessage
 * 메세지 전송을 요청하는 액션 생성자입니다.
 * 
 * @param {string} text 보내고자 하는 메세지
 */
const sendMessage = (text) => {
  return ({
    type: SEND_MESSAGE,
    text
  });
}

function chattingApp(state = { chatData: {} }, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      let newChatData = Object.assign({}, state.chatData);

      newChatData[`chat_${Date.now()}`] = {
        content: action.text,
        writer: 'test'
      };

      return Object.assign({}, state, { chatData: newChatData });
      
    default:
      return state;
  }

}
