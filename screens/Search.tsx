import { useQuery } from '@tanstack/react-query';
import react, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { moviesApi, tvApi } from '../api';
import Loader from '../components/Loader';
import HList from '../components/HList';

const Search = () => {
  const [query, setQuery] = useState('');

  const {
    isLoading: moviesLoading,
    data: movieData,
    refetch: searchMovie,
  } = useQuery({
    queryKey: ['searchMovies', query],
    queryFn: moviesApi.search,
    enabled: false,
  });

  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTV,
  } = useQuery({
    queryKey: ['searchTv', query],
    queryFn: tvApi.search,
    enabled: false,
  });

  const onChangeText = (text: string) => {
    setQuery(text);
  };
  const onSubmit = (text: string) => {
    if (query === '') {
      return;
    }
    searchMovie();
    searchTV();
  };

  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextColor="gray"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {moviesLoading || tvLoading ? <Loader /> : null}
      {movieData && <HList title="Movies Results" data={movieData?.results} />}
      {tvData && <HList title="TV Results" data={tvData?.results} />}
    </Container>
  );
};

export default Search;

const Container = styled.ScrollView``;
const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
  margin-bottom: 40px;
`;
