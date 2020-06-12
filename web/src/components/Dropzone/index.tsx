import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';


import './style.css'

interface Props {
    fileUpload: (file: File) => void
}

const Dropzone: React.FC<Props> = ({fileUpload}) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0]
        const fileUrl = URL.createObjectURL(file)
        
        setSelectedFileUrl(fileUrl)
        fileUpload(file)

    }, [fileUpload])
    
    const {getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} accept="image/*"/>
        {
            selectedFileUrl
                ? <img src={selectedFileUrl} alt="Point thumbnail" />
                : (
                    isDragActive ?
                    <p>Solte a imagem aqui ...</p> :
                    <p>
                        <FiUpload />
                        Arraste e solte alguma imagem aqui ou clique para selecionar {<br/>} uma imagem!
                    </p>
                )
        }
        </div>
    )
}

export default Dropzone;