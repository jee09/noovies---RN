import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, View, RefreshControl, FlatList } from 'react-native';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import Slide from '../components/Slides';
import VMedia from '../components/VMedia';
import HMedia from '../components/HMedia';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { MovieResponse, moviesApi, Movie } from '../api';
import Loader from '../components/Loader';
import HList from '../components/HList';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = ({ navigation: { navigate } }) => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery<MovieResponse>({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: moviesApi.nowPlaying,
  });

  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ['movies', 'upcoming'],
    queryFn: moviesApi.upcoming,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
    initialPageParam: 1,
  });

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ['movies', 'trending'],
    queryFn: moviesApi.trending,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
    initialPageParam: 1,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey: ['movies'],
    });
    setRefreshing(false);
  };

  const renderHMedia = ({ item }: { item: Movie }) => (
    <HMedia
      posterPath={item.poster_path || ''}
      originalTitle={item.original_title}
      overview={item.overview}
      releaseDate={item.release_date}
      fullData={item}
    />
  );
  const movieKeyExtractor = (item: Movie, index: number) => item.id.toString() + index.toString();

  const loading = trendingLoading || upcomingLoading || nowPlayingLoading;

  const loadMore = () => {
    if (upcomingHasNextPage) {
      upcomingFetchNextPage();
    }
    if (trendingHasNextPage) {
      trendingFetchNextPage();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={upcomingData?.pages.map((page) => page.results).flat()}
        keyExtractor={movieKeyExtractor}
        ItemSeparatorComponent={HSeperator}
        renderItem={renderHMedia}
        ListHeaderComponent={
          <>
            <Swiper
              loop
              autoplay
              horizontal
              autoplayTimeout={3.5}
              showsButtons={false}
              showsPagination={false}
              containerStyle={{
                marginBottom: 40,
                width: '100%',
                height: SCREEN_HEIGHT / 4,
              }}
            >
              {nowPlayingData?.results.map((movie) => (
                <Slide
                  key={movie.id}
                  backdropPath={movie.backdrop_path || ''}
                  posterPath={movie.poster_path || ''}
                  originalTitle={movie.original_title}
                  voteAverage={movie.vote_average}
                  overview={movie.overview}
                  fullData={movie}
                />
              ))}
            </Swiper>
            {trendingData && (
              <HList
                title="Trending Movies"
                data={trendingData?.pages.map((page) => page.results).flat()}
                loadInfinity={loadMore}
              />
            )}

            <ComingSoonTitle>Coming soon</ComingSoonTitle>
          </>
        }
      />
    </>
  );
};

export default Movies;

const Container = styled(FlatList<Movie>)`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 30px;
`;
const TrendingScroll = styled(FlatList<Movie>)``;
const VSeperator = styled.View`
  width: 20px;
`;
const HSeperator = styled.View`
  height: 20px;
`;
