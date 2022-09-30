import React, { useEffect, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '../../components/Background'
import { GameCardProps } from '../../components/GameCard'
import { useRoute } from '@react-navigation/native'
import { styles } from './styles'
import { GameParams } from '../../@types/navigation'
import { TouchableOpacity, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { THEME } from '../../theme'
import logoImg from '../../assets/logo-nlw-esports.png'
import { Header } from '../../components/Header'
import { useNavigation } from '@react-navigation/native'
import { DuoCard, DuoCardProps } from '../../components/DuoCard'
import { DuoMatch } from '../../components/DuoMatch'

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('s')

  const route = useRoute()
  const game = route.params as GameParams

  const navigation = useNavigation()

  useEffect(() => {
    fetch(`http://172.31.224.1:3333/games/${game.id}/ads`)
      .then((res) => res.json())
      .then((data) => setDuos(data))
  }, [])

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://172.31.224.1:3333/ads/${adsId}/discord`)
      .then((res) => res.json())
      .then((data) => setDiscordDuoSelected(data.discord))
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
              onPress={handleGoBack}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo}></Image>

          <View style={styles.right}></View>
        </View>

        <Image
          style={styles.cover}
          resizeMode="cover"
          source={{ uri: game.bannerUrl }}
        ></Image>

        <Header
          title={game.title}
          subtitle="Conecte-se e comece a jogar"
        ></Header>

        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard onConnect={() => getDiscordUser(item.id)} data={item} />
          )}
          horizontal
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent,
          ]}
          style={styles.containerList}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados para esse jogo
            </Text>
          )}
        />

        <DuoMatch
          onClose={() => setDiscordDuoSelected('')}
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
        />
      </SafeAreaView>
    </Background>
  )
}
