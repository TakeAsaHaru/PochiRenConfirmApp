import { Box, Button } from "@chakra-ui/react";

import jsondjangoapp from "../api/jsondjangoapp";

export function Target(props: {
  userId: string | undefined;
  taskId: string | undefined;
}) {
  const addTarget = async () => {
    if (props.userId && props.taskId) {
      let postData: any = [];
      console.log(props.userId);
      console.log(props.taskId);
      postData = [...postData, { user: props.userId, task: props.taskId }];
      console.log(postData);
      const target = await jsondjangoapp.post("/api/v1/user_task/", {
        // postData,
        user: props.userId,
        task: props.taskId,
      });
      //   console.log(target);
    } else {
      console.log("");
    }
  };

  return (
    <Box mt={10}>
      <Button colorScheme="cyan" color="white" onClick={addTarget}>
        タスク対象者
      </Button>
    </Box>
  );
}
