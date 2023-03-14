import { Box, Button, Flex, Icon, Input } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

import jsondjangoapp from "../api/jsondjangoapp";

type postChoiceInfo = {
  choice: string;
  task: string;
};

export function Choice(props: { taskId: string }) {
  // 選択肢
  const [choices, setChoices] = useState<string[]>([]);

  // 選択肢入力フィールド追加
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  // 選択肢更新
  const updateChoices = (choiceValue: string, choiceIndex: number) => {
    setChoices(
      choices.map((choice, index) =>
        index === choiceIndex ? choiceValue : choice
      )
    );
  };

  // 選択肢登録
  const registerChoices = () => {
    const test = choices.map(async (choi) => {
      await jsondjangoapp.post("/api/v1/choice/", {
        choice: choi,
        task: props.taskId,
      });
    });
    console.log(test);
  };
  return (
    <Flex my={2} direction="column">
      <Box>選択肢</Box>
      {choices.map((choice, index) => {
        return (
          <Input
            key={index}
            onChange={(e) => {
              updateChoices(e.target.value, index);
            }}
          />
        );
      })}
      <Icon as={AiOutlinePlusCircle} w={10} h={10} onClick={addChoice} />
      <Button colorScheme="teal" mt={5} w="100%" onClick={registerChoices}>
        Add
      </Button>
    </Flex>
  );
}
