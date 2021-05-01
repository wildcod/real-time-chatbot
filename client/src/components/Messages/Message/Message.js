import React from 'react';

import style from './Message.module.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className={[style.messageContainer,style.justifyEnd].join(" ")}>
          <p className={[style.sentText , style.prten].join(" ")}>{trimmedName}</p>
          <div className={[style.messageBox ,style.backgroundBlue].join(" ")}>
            <p className={[style.messageText,style.colorWhite]}>{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
        )
        : (
          <div className={[style.messageContainer,style.justifyStart].join(" ")}>
            <div className={[style.messageBox ,style.backgroundLight].join(" ")}>
              <p className={[style.messageText,style.colorDark]}>{ReactEmoji.emojify(text)}</p>
            </div>
            <p className={[style.sentText ,style.plten]}>{user}</p>
          </div>
        )
  );
}

export default Message;