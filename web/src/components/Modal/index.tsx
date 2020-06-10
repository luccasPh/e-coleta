import React from 'react'
import './style.css'
import check from '../../assets/check.svg'
import {FiArrowLeft} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";

interface ModalProps {
  displayModal: boolean
  displayLoading: boolean
}

const override = css`
    width: 100px;
    height: 100px;
    margin-left: 42%;
    padding: 40px;
`;

const Modal: React.FC<ModalProps> = (props) => {
  
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
            {props.displayLoading
              ?(
                <div 
                  className="itemsLoading"
                  style={{marginTop: '26%'}}
                >
                    <ClipLoader
                        css={override} 
                        loading={true}
                        color={"#2FB86E"}     
                    />
                    <span style={{color: 'white'}}>Salvado ponto...</span>
                </div>
              )
              :(
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
              )
            }
            </div>

          </div>
      </div>
    );
}

export default Modal;
