import React, { useEffect, useState} from 'react'
import { View, Image, ImageBackground, Text, StyleSheet, Alert } from 'react-native'
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import RNPickerSelect from 'react-native-picker-select';
import api from '../../services/api'

interface States{
  uf: string,
}

interface Cities{
  city: string
}

interface Item{
  label: string
  value: string
}

const Home = () => {
    const navigation = useNavigation()
    const [itemsState, setItemsState] = useState<Item[]>([])
    const [itemsCities, setItemsCities] = useState<Item[]>([])

    const [selectedUf, setSelectedUf] = useState("0")
    const [selectedCity, setSelectedCity] = useState("0")

    useEffect(() => {
      const data = [{
        label: '',
        value: ''
      }]

      SecureStore.getItemAsync('token').then(token => {
        api.get<States[]>(`points/uf/`, {
          headers: {
            Authorization: token
          }

        }).then(response => {
            response.data.map(state => {
              data.push({
                label: state.uf, 
                value: state.uf
              })
            })
            data.shift()
            const dataFilter = Array.from(new Set(data.map(a => a.label)))
              .map(label => {
                return data.find(a => a.label === label)
              })
            
            setItemsState(dataFilter)
        })
      })
    }, [])

    useEffect(() => {
      if(selectedUf === "0") {
          return
      }
  
      const data = [{
        label: '',
        value: ''
      }]

      SecureStore.getItemAsync('token').then(token => {
        api.get<Cities[]>(`points/${selectedUf}/city/`, {
          headers: {
            Authorization: token
          }
          
        }).then(response => {
            response.data.map(uf => {
              data.push({
                label: uf.city, 
                value: uf.city
              })
            })

            data.shift()
            const dataFilter = Array.from(new Set(data.map(a => a.label)))
              .map(label => {
                return data.find(a => a.label === label)
              })
            setItemsCities(dataFilter)
        })
      })

    }, [selectedUf])

    function handleNavigationPoints(){
      if(selectedUf === null || selectedUf === "0"){
        Alert.alert("Atenção", "Selecione um Estado!")
        return
      }
      else if(selectedCity === null || selectedCity === "0"){
        Alert.alert("Atenção", "Selecione uma Cidade!")
        return
      }

      navigation.navigate('Points',{
        selectedUf,
        selectedCity
      })
    }

    function handleSelectUf(uf: string){
      setSelectedCity("0")
      setSelectedUf(uf)
    }

    function handleSelectCity(city: string){
      setSelectedCity(city)
    }
    
    return (
        <ImageBackground
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{ width: 274, height: 368 }}
        >
          <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>

          <View style={styles.footer}>
            <RNPickerSelect
              style={{inputAndroid:{
                  height: 60,
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  marginBottom: 8,
                  paddingHorizontal: 34,
                  overflow: 'hidden',
                  alignItems: 'center',
                  fontFamily: 'Roboto_500Medium',
                  color: '#322153',
                  fontSize: 16, // to ensure the text is never behind the icon
                },
                  iconContainer: {
                  top: 15,
                },}}
                Icon = {() => {return(
                    <Icon.Button
                        name="chevron-down"
                        color={'black'}
                        size={15}
                        backgroundColor="transparent"
                        underlayColor="transparent"
                      >
                    </Icon.Button>);
              }}
              placeholder={{label: 'Selecione um Estado', value: "0"}}
              items={itemsState}
              onValueChange={(value) => handleSelectUf(value)}
            />
            <RNPickerSelect
              style={{inputAndroid:{
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 34,
                overflow: 'hidden',
                alignItems: 'center',
                fontFamily: 'Roboto_500Medium',
                color: '#322153',
                fontSize: 16, // to ensure the text is never behind the icon
              },
                iconContainer: {
                top: 15,
              },}}
              Icon = {() => {return(
                  <Icon.Button
                      name="chevron-down"
                      color={'black'}
                      size={15}
                      backgroundColor="transparent"
                      underlayColor="transparent"
                    >
                  </Icon.Button>);
            }}
              onValueChange={(value) => handleSelectCity(value)}
              placeholder={{label: 'Selecione uma Cidade', value: null}}
              items={itemsCities}
            />
            <RectButton style={styles.button} onPress={handleNavigationPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="search" color="#fff" size={24}/>
                </Text>
              </View>
              <Text style={styles.buttonText}>
                Procura
              </Text>
            </RectButton>
          </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {
      backgroundColor: 'transparent',
    },
  
    select: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 34,
      fontSize: 16,
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: "hidden",
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;