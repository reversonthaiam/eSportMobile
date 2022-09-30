import React, { useEffect, useState } from 'react'
import { FlatList, Image } from 'react-native'
import logoImg from '../../assets/logo-nlw-esports.png'
import { GameCard, GameCardProps } from '../../components/GameCard'
import { Header } from '../../components/Header'
import { styles } from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '../../components/Background'
import { useNavigation } from '@react-navigation/native'
export function Home() {
  const [games, setGames] = useState<GameCardProps[]>([])

  useEffect(() => {
    fetch('http://172.31.224.1:3333/games')
      .then((res) => res.json())
      .then((data) => setGames(data))
  }, [])

  const navigation = useNavigation()

  function handleOpenGame({ id, title, bannerUrl}: GameCardProps) {
    navigation.navigate('game', {id, title, bannerUrl})
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image source={logoImg} style={styles.logo} />

        <Header
          title="Encontre seu duo!"
          subtitle="Selecione o game que voce deseja jogar..."
        />

        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard data={item} onPress={() => handleOpenGame(item)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentList}
        />
      </SafeAreaView>
    </Background>
  )
}
