import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import Notifications, { notify } from 'react-notify-toast';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";

import api from '../../services/api'
import ibge from '../../services/ibge'
import logo from "../../assets/logo.svg";
import Modal from '../../components/Modal'
import Dropzone from "../../components/Dropzone"

import './styles.css'
import { TIMEOUT } from 'dns';


interface Item{
    id: number,
    title: string,
    image_url: string
}

interface State{
    sigla: string,
    nome: string
}

interface City{
    nome: string
}

const override = css`
    margin-left: 42%;
    padding: 40px;
`;


const CreatePoints = () => {
    const [items, setItems] = useState<Item[]>([])
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])

    const [selectedUf, setSelectedUf] = useState("0")
    const [selectedCity, setSelectedCity] = useState("0")
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])
    const [initialZoom, setinitialZoom] = useState(14)
    const [selectedFile, setSelectedFile] = useState<File>()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        street: '',
        cep: '',
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [modal, setModal] = useState({
        display: false,
        loading: false,
    })


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)        
        })
    }, [])

    useEffect(() => {
        ibge.get('estados').then(response => {
            setStates(response.data)
        }) 
    }, [])

    useEffect(() => {
        if(selectedUf === '0') {
            return
        }

        ibge.get(`estados/${selectedUf}/municipios`).then(response => {
            setCities(response.data)
        })

    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setinitialPosition([latitude, longitude])
        })
    }, [])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        if(name === "whatsapp" || name === "cep"){
            if(isNaN(Number(value))){
                return
            }
        }
        
        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }
        else{
            setSelectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault()
        let isError = false
        const {name, email, whatsapp, street} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        if(selectedFile?.name === undefined){
            notify.show('Selecione uma imagem', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(name === ''){
            notify.show('Digite o Nome da Entidade!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(email === ''){
            notify.show('Digite um Email!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(whatsapp === ''){
            notify.show('Digite um numero de Whatsapp!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(whatsapp.length < 10){
            notify.show('Digite um numero de Whatsapp valido!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(latitude === 0){
            notify.show('Marque um Endereço no mapa!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(street === ''){
            notify.show('Marque um Endereço no mapa!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(uf === "0"){
            notify.show('Selecione um Estado!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(city === "0"){
            notify.show('Selecione uma Cidade!', 'warning')
            window.scrollTo(0, 0)
            return
        }
        else if(items.length === 0){
            notify.show('Selecione pelo menos um Item para reciclagem', 'warning')
            window.scrollTo(0, 0)
            return
        }

        const dataSubmit = new FormData()

        if(selectedFile){
            dataSubmit.append('image', selectedFile)
        }
        dataSubmit.append('name', name)
        dataSubmit.append('email', email)
        dataSubmit.append('whatsapp', whatsapp)
        dataSubmit.append('latitude', String(latitude))
        dataSubmit.append('longitude', String(longitude))
        dataSubmit.append('street', street)
        dataSubmit.append('uf', uf)
        dataSubmit.append('city', city)
        dataSubmit.append('items', items.join(','))

        setModal({
            display: true,
            loading: true,
        })

        
        await api.post('points/', dataSubmit)
            .catch((errors) => {
                if( errors.response ){
                    isError = true 
            }
        })
        
        if(isError){
            notify.show("Não foi posvile salva seu ponto de coleta, tente novamente!", "error")
            return
        }
        document.body.style.overflow = 'hidden';

        setModal({
            display: true,
            loading: false,
        })
        
    }

    
    async function searchCEP(){
        await api.get(`search-cep/${formData.cep}`).then(response =>{
            const { latitude, logradouro, longitude } = response.data
            setinitialPosition([latitude, longitude])
            setinitialZoom(16)
            setFormData({...formData, ['cep']: ''})
            
            if(logradouro !== undefined){
                setFormData({...formData, ['street']: logradouro})
            }
        })
    }
    
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="E-Coleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do ponto de coleta</h1>
                
                <fieldset>
                    <legend>
                        <h2>Imagem</h2>
                    </legend>

                    <Dropzone fileUpload={setSelectedFile}/>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                maxLength={10}
                                value={formData.whatsapp}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend style={{marginBottom: "10px"}}>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <div className="field-cep">
                        <input 
                            type="text"
                            name="cep"
                            id="cep"
                            placeholder="Pesquisa pelo cep..."
                            onChange={handleInputChange}
                            maxLength={8}
                            value={formData.cep}
                        />
                        <button
                            type="button"
                            onClick={() => searchCEP()}
                        >
                            <span>
                                <FiSearch />
                            </span>
                        </button>
                    </div>

                    {initialPosition[0] !== 0 && (
                        <Map center={initialPosition} zoom={initialZoom} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                            <Marker position={selectedPosition} zoom={15} />
                        </Map>
                    )}

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione</option>
                                {states.map( state => (
                                    <option key={state.sigla} value={state.sigla}>{state.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione</option>
                                {cities.map( city => (
                                    <option key={city.nome} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="street">Logradouro/Rua</label>
                        <input 
                            type="text"
                            name="street"
                            id="street"
                            onChange={handleInputChange}
                            value={formData.street}
                        />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    {items.length !== 0 ? (
                        <ul className="items-grid">
                        {items.map(item =>(
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                    ):(
                        <div className="itemsLoading">
                            <ClipLoader
                                css={override} 
                                loading={true}
                                color={"#2FB86E"}     
                            />
                            <span>Carregando ítems...</span>
                        </div>
                    )}
                </fieldset>
                
                <button type="submit">
                    Cadastra ponto de coleta
                </button>
            </form>

            <Modal 
                displayModal={modal.display}
                displayLoading={modal.loading}
            />
            <Notifications options={{zIndex: 200, top: '20px'}}/>
        </div>
    )
};

export default CreatePoints;