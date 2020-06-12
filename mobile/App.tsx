import React, { useEffect, useState } from 'react';
import { AppLoading } from 'expo';
import { StatusBar } from 'react-native'

import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import * as SecureStore from 'expo-secure-store';

import Routes from './src/routes'
import api from './src/services/api'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  const [tokenLoaded, setTokenLoaded] = useState(false)

  useEffect(() => {
    const form = {
      username: "mobile",
      password: "lucas10p"
    }
    api.post('login/', form).then(response => {
      SecureStore.setItemAsync('token', `JWT ${response.data.token}`)
      setTokenLoaded(true)
    })
  }, [])

  if(!fontsLoaded || !tokenLoaded){
    return <AppLoading />
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />
    </>
  );
}

