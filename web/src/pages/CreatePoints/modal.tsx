import React from 'react'
import './modal.css'
import check from '../../assets/check.svg'
import {FiArrowLeft} from 'react-icons/fi'
import {useHistory} from 'react-router-dom'

interface ModalProps {
  displayModal: boolean
}

const Modal: React.FC<ModalProps> = props => {
  
  const divStyle = {
    display: props.displayModal ? 'block' : 'none',
  };

  const history = useHistory()

  function handleOk(){
    document.body.style.overflow = 'unset';
    history.push('/')
  }

    return (
      <div id="modal-id">
        <div 
            className="modal"
          
            style={divStyle}>

            <div className="modal-content"
              onClick={ e => e.stopPropagation() }>
              <div className="modal-flex">
                <img src={check} alt="Check"/>
                <br />
                <h1>Cadastro concluído!</h1>
                <a href="#" onClick={handleOk}>
                  <span>
                    <FiArrowLeft/>
                  </span>
                  <strong>Ok</strong>
                </a>
              </div>

            </div>

          </div>
      </div>
    );
}

export default Modal;
