import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";

import jsondjangoapp from "../api/jsondjangoapp";

type LoginInfo = {
  email: string;
  password: string;
};

type Token = {
  access: string;
  refresh: string;
};

export function Login() {
  const [user, setUser] = useState<LoginInfo>();
  const [token, setToken] = useState<Token>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInfo>();

  const getToken = async (user: LoginInfo) => {
    try {
      const token = await jsondjangoapp.post("/api/auth/jwt/create/", {
        email: "haru@haru.com",
        password: "haru0607",
      });
      console.log(token.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit: SubmitHandler<LoginInfo> = async (data) => {
    try {
      const token = await jsondjangoapp.post("/api/auth/jwt/create/", {
        email: data.email,
        password: data.password,
      });
      console.log(token.data);
      setToken(token.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex direction="column" align="start">
      <Box w="50%" mb={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "メールアドレスは必須です" })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>password</FormLabel>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "パスワードは必須です" })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit" colorScheme="teal" mt={5} w="100%">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
      <Box maxW="md">
        <Flex direction="column">
          <Text>access:</Text>
          <Text mb={5}>{token?.access}</Text>
          <Text>refresh:</Text>
          <Text>{token?.refresh}</Text>
        </Flex>
      </Box>
    </Flex>
  );
}
