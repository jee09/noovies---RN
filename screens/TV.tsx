import { FlatList, RefreshControl, ScrollView } from 'react-native';
import { QueryClient, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { TvResponse, tvApi } from '../api';
import Loader from '../components/Loader';
import VMedia from '../components/VMedia';
import HList from '../components/HList';
import React, { useState } from 'react';

const Tv = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    isLoading: todayLoading,
    data: todayData,
    hasNextPage: todayHasNextPage,
    fetchNextPage: todayFetchNextPage,
  } = useInfiniteQuery<TvResponse>({
    queryKey: ['tv', 'today'],
    queryFn: tvApi.airingToday,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
    initialPageParam: 1,
  });

  const {
    isLoading: topLoading,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
  } = useInfiniteQuery<TvResponse>({
    queryKey: ['tv', 'top'],
    queryFn: tvApi.topRated,
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
  } = useInfiniteQuery<TvResponse>({
    queryKey: ['tv', 'trending'],
    queryFn: tvApi.trending,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
    initialPageParam: 1,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey: ['tv'],
    });
    setRefreshing(false);
  };
  const loading = todayLoading || topLoading || trendingLoading;

  const loadMore = () => {
    if (topHasNextPage) {
      topFetchNextPage();
    }
    if (trendingHasNextPage) {
      trendingFetchNextPage();
    }
    if (todayHasNextPage) {
      todayFetchNextPage();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 30 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <HList
        title="Trending TV"
        data={trendingData?.pages.map((page) => page.results).flat()}
        loadInfinity={loadMore}
      />
      <HList
        title="Airang Today"
        data={todayData?.pages.map((page) => page.results).flat()}
        loadInfinity={loadMore}
      />
      <HList
        title="Top Ratied TV"
        data={topData?.pages.map((page) => page.results).flat()}
        loadInfinity={loadMore}
      />
    </ScrollView>
  );
};

export default Tv;
