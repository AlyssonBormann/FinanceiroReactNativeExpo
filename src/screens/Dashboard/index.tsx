import React from "react";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Desenvolvimento de site",
      amount: "R$ 2.323,00",
      category: { name: "Vendas", icon: "dollar-sign" },
      date: "11/02/2022",
    },
    {
      id: "2",
      type: "negative",
      title: "Hamburgueria & Pizza",
      amount: "R$ 45,00",
      category: { name: "Alimentação", icon: "coffee" },
      date: "11/02/2022",
    },
    {
      id: "3",
      type: "negative",
      title: "Aluguel do apartamento",
      amount: "R$ 500,00",
      category: { name: "Casa", icon: "shopping-bag" },
      date: "11/02/2022",
    },
  ];
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/11725888?v=4",
              }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Bormann</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => console.log("BUnda")}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="1.800,00"
          lastTransaction="Última entrada dia 11 de janeiro"
        />
        <HighlightCard
          type="down"
          title="Saída"
          amount="800,00"
          lastTransaction="Última saída dia 01 de janeiro"
        />
        <HighlightCard
          type="total"
          title="Total "
          amount="1.600,00"
          lastTransaction="01 à 11 janeiro"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
