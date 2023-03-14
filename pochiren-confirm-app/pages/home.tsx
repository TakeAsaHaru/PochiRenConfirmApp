import { Box, Divider, Heading } from "@chakra-ui/react";
import { Login } from "./components/login";
import { Task } from "./components/task";
import { User } from "./components/user";

export default function Home() {
  return (
    <Box w={1500} m={10}>
      <Heading>ログイン機能確認</Heading>
      <Login />
      {/* <Divider borderColor="blue" mb={10} />
      <Heading>タスク関連機能確認</Heading>
      <Task />
      <Divider borderColor="blue" mb={10} />
      <Heading>ユーザー登録機能確認</Heading>
      <User /> */}
    </Box>
  );
}
