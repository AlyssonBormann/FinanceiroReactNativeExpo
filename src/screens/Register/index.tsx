import React, { useState } from "react";
import { Modal, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Header,
  Title,
  Form,
  Fieds,
  TransactionsTypes,
} from "./styles";

export type FormData = {
  [name: string]: any;
};

type NavigationProps = { navigate: (screen: string) => void };

const schema = Yup.object().shape({
  name: Yup.string().required("Por favor, informe o nome."),
  amount: Yup.number()
    .typeError("Informe um valor númerico.")
    .positive("O valor não pode ser negativo.")
    .required("Por favor, informe o preço."),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function handleTransactionTypeSelect(type: "positive" | "negative") {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleSubmitRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert(
        "Atenção",
        "Por favor, selecione o tipo da transação."
      );
    }

    if (category.key === "category") {
      return Alert.alert("Atenção", "Por favor, selecione uma categoria.");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = "@gofinances:transactions";

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      Alert.alert("Sucesso", "Salvo com sucesso!");

      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar.", `${error}`);
    }
  }

  return (
    //<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fieds>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Entrada"
                onPress={() => handleTransactionTypeSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Saída"
                onPress={() => handleTransactionTypeSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionsTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fieds>
          <Button title="Enviar" onPress={handleSubmit(handleSubmitRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </>
  );
}
