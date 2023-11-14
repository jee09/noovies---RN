import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import VMedia from './VMedia';

interface HListProps {
  title: string;
  data: any;
  loadInfinity: any;
}

const HList: React.FC<HListProps> = ({ title, data, loadInfinity }) => (
  <ListContainer>
    <ListTitle>{title} </ListTitle>
    <FlatList
      data={data}
      horizontal
      onEndReached={loadInfinity}
      onEndReachedThreshold={0.5}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HListSeparator}
      contentContainerStyle={{ paddingHorizontal: 30 }}
      keyExtractor={(item, index: number) => item.id.toString() + index.toString()}
      renderItem={({ item }) => (
        <VMedia
          posterPath={item.poster_path}
          originalTitle={item.original_title ?? item.original_name}
          voteAverage={item.vote_average}
          fullData={item}
        />
      )}
    />
  </ListContainer>
);

export default HList;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;

export const HListSeparator = styled.View`
  width: 20px;
`;
