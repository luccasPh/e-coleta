import React, {useEffect, useState} from 'react'
import Constants from 'expo-constants'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Image ,Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native'
import { RectButton } from "react-native-gesture-handler";
import * as MailComposer from 'expo-mail-composer';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api'

interface Params {
    point_id: number
}

interface Point {
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    street: string,
    city: string
    uf: string
    items: {
        title: string
    }[]
}

const Detail = () => {
    const [point, setPoint] = useState<Point>({} as Point)
    const navigation = useNavigation()
    const route = useRoute()
    const routeParams = route.params as Params

    useEffect(() => {
      SecureStore.getItemAsync('token').then(token => {
        api.get(`points/${routeParams.point_id}`, {
          headers: {
            Authorization: token
          }
        }).then(response => {
            setPoint(response.data)
        })
      })

    }, [])

    function handleNavigateBack(){
        navigation.goBack()
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: "Interesse na coleta de resíduos",
            recipients: [point.email],
        })
    }

    function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text=Tenho Interese na coleta de resíduos`)
    }

    if(!point || !point.items){
        return null
    }
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: point.image }} />

                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointItems}>
                    {point.items.map(item => item.title).join(", ")}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressText}>{point.street}</Text>

                    <View style={styles.addressContent}>
                      <Text style={[styles.addressText, {paddingRight: 4}]}>{point.city},</Text>
                      <Text style={styles.addressText}>{point.uf}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    pointImage: {
      width: '100%',
      height: 180,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#34CB79'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      flexDirection: 'row',

    },

    addressText: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

export default Detail;