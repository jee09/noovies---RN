import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Movie, TV, moviesApi, tvApi } from '../api';
import Poster from '../components/Poster';
import { Dimensions, StyleSheet, Share, Pressable, Platform } from 'react-native';
import { makeImgPath } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../colors';
import { useQuery } from '@tanstack/react-query';
import Loader from '../components/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';

type RootStackParamList = {
  Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const Detail: React.FC<DetailScreenProps> = ({ navigation: { setOptions }, route: { params } }) => {
  const isMovie = 'original_title' in params;
  const isAndroid = Platform.OS === 'android';

  const { isLoading, data } = useQuery({
    queryKey: [isMovie ? 'Movies' : 'tv', params.id],
    queryFn: isMovie ? moviesApi.detail : tvApi.detail,
  });

  const openYTLink = async (videoId: string) => {
    const baseUrl = `https://m.youtube.com/watch?v=${videoId}`;
    // await Linking.openURL(baseUrl);
    await WebBrowser.openBrowserAsync(baseUrl);
  };

  const shareMedia = async () => {
    if (isAndroid) {
      await Share.share({
        message: `Title: ${
          'original_title' in params ? params.original_title : params.original_name
        } overview: ${params.overview}\nCheck it out: ${data.homepage}`,
      });
    }
    await Share.share({
      url: isMovie ? `https://www.imdb.com/title/${data.imdb_id}` : data.homepage,
      title: 'original_title' in params ? params.original_title : params.original_name,
    });
  };

  useEffect(() => {
    setOptions({
      title: 'original_title' in params ? 'Movie' : 'TV Show',
    });
  }, []);

  useEffect(() => {
    if (data) {
      setOptions({
        headerRight: () => <ShareButton />,
      });
    }
  }, [data]);
  const ShareButton = () => (
    <Pressable onPress={shareMedia}>
      <Ionicons name="share-outline" size={24} color="white" />
    </Pressable>
  );
  return (
    <Container>
      <Header>
        <BackGround
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path || '') }}
        />
        <LinearGradient colors={['transparent', colors.charcoal]} style={StyleSheet.absoluteFill} />
        <Column>
          <Poster path={params.poster_path || ''} />
          <Title>{'original_title' in params ? params.original_title : params.original_name}</Title>
        </Column>
      </Header>
      <Data>
        <OverView>{params?.overview}</OverView>
        {isLoading && <Loader />}
        {data?.videos?.results?.map((video) => (
          <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
            <Ionicons name="logo-youtube" color={'white'} size={20} />
            <BtnText>{video.name}</BtnText>
          </VideoBtn>
        ))}
      </Data>
    </Container>
  );
};
export default Detail;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;
const Txt = styled.Text``;
const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0 10px;
`;
const BackGround = styled.Image``;
const Column = styled.View`
  flex-direction: row;
`;
const Title = styled.Text`
  color: white;
  font-size: 24px;
  align-self: flex-end;
  width: 80%;
  margin-left: 15px;
  font-weight: 500;
`;
const OverView = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin: 20px 0;
`;
const VideoBtn = styled.Pressable`
  flex-direction: row;
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 20px;
  margin-left: 10px;
`;
const Data = styled.View`
  padding: 0 20px;
`;
