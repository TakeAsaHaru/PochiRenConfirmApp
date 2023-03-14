import { useForm, SubmitHandler } from "react-hook-form";
import { cache, useState } from "react";

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
  Heading,
  Divider,
  Tab,
} from "@chakra-ui/react";

import jsondjangoapp from "../api/jsondjangoapp";
import { Task } from "./task";
import { User } from "./user";

type LoginInfo = {
  email: string;
  password: string;
};

type Token = {
  access: string;
  refresh: string;
};

type UserInfo = {
  id: string;
  staff_num: number;
  email: string;
  name: string;
  password: string;
  is_active: boolean;
  is_staff: boolean;
  is_manager: boolean;
  login_at: Date;
  not_active_at: Date;
  created_at: Date;
};

export function Login() {
  const [token, setToken] = useState<Token>();
  const [user, setUser] = useState<UserInfo>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInfo>();

  const onSubmit: SubmitHandler<LoginInfo> = async (data) => {
    try {
      const token = await jsondjangoapp.post("/api/auth/jwt/create/", {
        email: data.email,
        password: data.password,
      });
      setToken(token.data);
      sessionStorage.setItem("access", token.data["access"]);
      sessionStorage.setItem("refresh", token.data["refresh"]);
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const token = sessionStorage.getItem("access");
      const user = await jsondjangoapp.get("/api/user_individual/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      console.log(user.data.user);
      setUser(user.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Flex direction="row" align="start" mb={10}>
        <Box w="30%" mb={10}>
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
              <Button
                type="button"
                colorScheme="blue"
                mt={5}
                w="100%"
                onClick={getUser}
              >
                GET
              </Button>
            </Box>
          </form>
        </Box>
        <Box maxW="md" ml={10}>
          <Flex direction="column">
            <Heading size="md" mb={3}>
              トークン情報
            </Heading>
            <Text fontWeight="bold">access:</Text>
            <Text mb={5}>{token?.access}</Text>
            <Text fontWeight="bold">refresh:</Text>
            <Text mb={5}>{token?.refresh}</Text>
            <Heading size="md" mb={3}>
              ユーザー情報
            </Heading>
            <HStack>
              <Text fontWeight="bold">ID:</Text>
              <Text>{user?.id}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">staff_num:</Text>
              <Text>{user?.staff_num}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">email:</Text>
              <Text>{user?.email}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">name:</Text>
              <Text>{user?.name}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">password:</Text>
              <Text>{user?.password}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">is_active:</Text>
              <Text>{user?.is_active ? "True" : "False"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">is_staff:</Text>
              <Text>{user?.is_staff ? "True" : "False"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">is_manager:</Text>
              <Text>{user?.is_manager ? "True" : "False"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">login_at:</Text>
              <Text>{String(user?.login_at)}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">not_active_at:</Text>
              <Text>{String(user?.not_active_at)}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">created_at:</Text>
              <Text>{String(user?.created_at)}</Text>
            </HStack>
          </Flex>
        </Box>
      </Flex>
      <Divider borderColor="blue" mb={10} />
      <Heading>タスク関連機能確認</Heading>
      <Task userId={user?.id} />
      <Divider borderColor="blue" mb={10} />
      <Heading>ユーザー登録機能確認</Heading>
      <User />
    </Box>
  );
}
