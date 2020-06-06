import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import {FiArrowLeft} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {Map, TileLayer, Marker} from "react-leaflet";
import {LeafletMouseEvent} from "leaflet";
import api from '../../services/api'
import ibge from '../../services/ibge'
import Modal from './modal'
import Notifications, {notify} from 'react-notify-toast';

import './styles.css'
import logo from "../../assets/logo.svg";

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


const CreatePoints = () => {
    const [items, setItems] = useState<Item[]>([])
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])

    const [selectedUf, setSelectedUf] = useState("0")
    const [selectedCity, setSelectedCity] = useState("0")
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        street: ''
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [state, setState] = useState({
        modal: false,
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
    })

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
        let isError = false
        event.preventDefault()
        const {name, email, whatsapp, street} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            image: "fake-imagem",    
            name: name,
            email: email,
            whatsapp: whatsapp,
            latitude: latitude,
            longitude: longitude,
            street: street,
            uf: uf,
            city: city,
            items: items,
        }

        for (var [key, value] of Object.entries(data)) {
            if(value === '' || value === "0" || value === 0 || (key === 'items' && items.length === 0)){
                window.scrollTo(0, 0)
                
                if(key === 'image' && value === ''){
                    notify.show('Digite um Email', 'warning')
                }
                else if(key === 'name' && value === ''){
                    notify.show('Digite o Nome da Entidade!', 'warning')
                }
                else if(key === 'email' && value === ''){
                    notify.show('Digite um Email!', 'warning')
                }
                else if(key === 'whatsapp' && value === ''){
                    notify.show('Digite um numero de Whatsapp!', 'warning')
                }
                else if(key === 'latitude' && value === 0){
                    notify.show('Marque um Endereço no mapa!', 'warning')
                }
                else if(key === 'street' && value === ''){
                    notify.show('Marque um Endereço no mapa!', 'warning')
                }
                else if(key === 'uf' && value === "0"){
                    notify.show('Selecione um Estado!', 'warning')
                }
                else if(key === 'city' && value === "0"){
                    notify.show('Selecione uma Cidade!', 'warning')
                }
                else if(key === 'items' && items.length === 0){
                    notify.show('Selecione pelo menos um Item para reciclagem', 'warning')
                }

                return
                
            }
            
        }

        await api.post('points/', data)
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
        selectModal()
    }

    function selectModal (){
        setState({
          modal: true
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
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {initialPosition[0] !== 0 && (
                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
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
                            />
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

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
                </fieldset>
                
                <button type="submit">
                    Cadastra ponto de coleta
                </button>
            </form>

            <Modal 
                displayModal={state.modal}
            />
            <Notifications options={{zIndex: 200, top: '20px'}}/>
        </div>
    )
};

export default CreatePoints;