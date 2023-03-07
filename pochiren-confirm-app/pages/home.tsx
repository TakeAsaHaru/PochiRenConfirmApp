import { Box } from "@chakra-ui/react";
import { Login } from "./components/login";

export default function Home() {
  return (
    <Box w={1000} m={10}>
      <Login />
    </Box>
  );
}
