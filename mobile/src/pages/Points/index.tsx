import React, {useEffect, useState} from 'react'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Image ,Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import Emoji from 'react-native-emoji'; 
import MapView, { Marker } from 'react-native-maps'; 
import { SvgUri } from 'react-native-svg';
import api from '../../services/api'
import FastImage from 'react-native-fast-image'

interface Item{
  id: number,
  title: string,
  image_url: string
}

interface Params {
  selectedUf: string,
  selectedCity: string
}

interface PointLL {
  latitude: number,
  longitude: number
}

interface Point{
  id: number,
  name: string,
  image: string,
  latitude: number,
  longitude: number
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([])
    const [points, setPoints] = useState<Point[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [cityPosition, setCityPosition] = useState<PointLL>()
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])
    const route = useRoute()
    const routeParams = route.params as Params
    const navigation = useNavigation()

    useEffect(() => {
      api.get('items/').then(response => {
          setItems(response.data)        
      })
    }, [])

    useEffect(() => {
      api.get(`points/${routeParams.selectedCity}/ll/`).then(response => {
        setCityPosition(response.data)        
      })
    }, [])

    useEffect(() => {

      api.get('points/', {
        params: {
          city: routeParams.selectedCity,
          uf: routeParams.selectedUf,
          items: [selectedItems]
        }

      }).then(response => {
          setPoints(response.data)        
      })
    }, [selectedItems])

    useEffect(() => {
      async function loadPosition(){
        const { status } = await Location.requestPermissionsAsync()

        if(status != 'granted'){
          Alert.alert('Algo de errador nao esta certo...', 'Forneça permição para obter sua localização')
        }

        const location = await Location.getCurrentPositionAsync()
        const { latitude, longitude } = location.coords

        setinitialPosition([
          latitude,
          longitude
        ])
      }

      loadPosition()
    }, [])

    function handleNavigateBack(){
        navigation.goBack()
    }

    function handleNavigateDetail( id: number){
        navigation.navigate('Detail', { point_id: id })
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
    return (
        <>
            <View style={styles.container}> 
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>

                <View style={styles.emoji}>
                    <Emoji name="grinning" style={{fontSize: 15}} />
                    <Text style={styles.title}>Bem vindo.</Text>
                </View>
                
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                
                <View style={styles.mapContainer}>
                    {cityPosition?.latitude !== undefined && (
                      <MapView 
                          style={styles.map}
                          loadingEnabled = {cityPosition?.latitude === undefined}
                          initialRegion={{
                              latitude: cityPosition?.latitude,
                              longitude: cityPosition?.longitude,
                              latitudeDelta: 0.034,
                              longitudeDelta: 0.034
                          }}
                      >
                          {points.map(point => (
                            <Marker
                              key={String(point.id)}
                                onPress={() => handleNavigateDetail(point.id)}
                                style={styles.mapMarker} 
                                coordinate={{
                                    latitude: point.latitude,
                                    longitude: point.longitude,
                                }}
                            >
                                <View style={styles.mapMarkerContainer}>
                                    <Image style={styles.mapMarkerImage} source={{ uri: point.image, cache: "force-cache" }} />
                                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                </View>
                                <View style={styles.mapMarkerArrow}/>
                            </Marker>
                          ))}
                      </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                      <TouchableOpacity 
                        key={String(item.id)} 
                        style={[
                          styles.item,
                          selectedItems.includes(item.id) ? styles.selectedItem: {}
                        ]}
                        activeOpacity={0.6  } 
                        onPress={() => {handleSelectItem(item.id)}}
                      >
                          <SvgUri width={42} height={42} uri={item.image_url} />
                          <Text style={styles.itemTitle}>{item.title}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },

    emoji: {
        flexDirection: "row",
        marginTop: 20
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      paddingLeft: 10
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
      
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },

    mapMarkerArrow: {
        width: 10,
        height: 10,
        left: 38,
        bottom: 5,
        backgroundColor: '#34CB79',
        overflow: 'hidden',
        borderRadius: 2,
        transform: [{rotate: '45deg'}],

    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
      
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 105,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;

