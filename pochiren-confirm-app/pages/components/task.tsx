import { useForm, SubmitHandler, set } from "react-hook-form";
import {
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Icon,
  HStack,
  Text,
  Heading,
  VStack,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  Card,
  Divider,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

import jsondjangoapp from "../api/jsondjangoapp";
import { useState } from "react";
import { Console } from "console";

type TaskInfo = {
  id: string;
  title: string;
  content: string;
  is_done: boolean;
  is_choice: boolean;
  is_display_answer: boolean;
  is_deadline: boolean;
  is_shutout: boolean;
  deadline_at: Date;
  is_repeat: boolean;
  repeat_type: number;
  repeat_cond: number;
  created_at: Date;
};

type TaskStatus = {
  is_done: boolean;
  task: TaskInfo;
};

export function Task() {
  // 全タスク取得フラグ
  const [isAll, setIsAll] = useState(false);
  // 回答状況表示フラグ
  const [isDisplayAnswer, setIsDisplayAnswer] = useState(false);
  // 締切有無フラグ
  const [isDeadline, setIsDeadline] = useState(false);
  // 強制締切フラグ
  const [isShutout, setIsShutout] = useState(false);
  // 締切日時
  const [deadlineAt, setDeadlineAt] = useState<Date | null>();
  // 繰り返し有無フラグ
  const [isRepeat, setIsRepeat] = useState(false);
  // 繰り返し条件種類
  const [repeatType, setRepeatType] = useState<number>(0);
  // 繰り返し条件
  const [repeatCond, setRepeatCond] = useState<number>(0);
  // 繰り返し条件の対象週
  const [targetWeek, setTargetWeek] = useState<number>(1);
  // 繰り返し条件の対象日
  const [targetDate, setTargetDate] = useState<number>(1);
  // 繰り返し条件の対象曜日
  const [targetDay, setTargetDay] = useState<number>(0);
  // 更新後のタスクタイトル(モーダル)
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  // 更新後のタスク本文(モーダル)
  const [newTaskContent, setNewTaskContent] = useState<string>("");

  // 取得したタスク一覧
  const [taskList, setTaskList] = useState<TaskInfo[]>([]);
  //タスク対象者一覧
  const [taskStatusList, setTaskStatusList] = useState<TaskStatus[]>([]);
  // 選択中のタスクのID
  const [taskId, setTaskId] = useState("");
  // 選択中のタスク情報
  const [selectedTask, setSelectedTask] = useState<TaskInfo>();
  // モーダルに関するHook
  const { isOpen, onOpen, onClose } = useDisclosure();

  // タスク登録用のフックフォーム
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskInfo>();

  // タスク登録
  const onSubmit: SubmitHandler<TaskInfo> = async (data) => {
    updateRepeatCond();
    try {
      const task = await jsondjangoapp.post("/api/v1/task/", {
        title: data.title,
        content: data.content,
        is_display_answer: isDisplayAnswer,
        is_deadline: isDeadline,
        is_shutout: isShutout,
        deadline_at: deadlineAt,
        is_repeat: isRepeat,
        repeat_type: repeatType,
        repeat_cond: repeatCond,
      });
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  // 全タスク取得
  const retrieveAllTask = async () => {
    const task = await jsondjangoapp.get("/api/v1/task/");
    setTaskList(task.data);
  };

  // タスク取得(個人)
  const retrieveTargetTask = async () => {
    const token = sessionStorage.getItem("access");
    const task = await jsondjangoapp.get("/api/v1/user_task/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    setTaskStatusList(task.data);
  };

  // 選択中のタスク削除(axious)
  const deleteTask = async () => {
    const task = await jsondjangoapp.delete(`/api/v1/task/${taskId}/`);
  };

  // 選択中のタスク内容更新(axious)
  // ※タスクタイトルとタスク本文のみ
  const updateTask = async () => {
    const task = await jsondjangoapp.patch(`/api/v1/task/${taskId}/`, {
      title: newTaskTitle ? newTaskTitle : selectedTask?.title,
      content: newTaskContent ? newTaskContent : selectedTask?.content,
    });
    console.log(task);
    setNewTaskTitle("");
    setNewTaskContent("");
  };

  // 締切日時更新
  const updateDeadLineAt = (dateTime: Date | null) => {
    if (dateTime) {
      setIsDeadline(true);
      setDeadlineAt(dateTime);
    } else {
      setIsDeadline(false);
      setDeadlineAt(null);
    }
  };

  // 繰り返し条件更新
  const updateRepeatCond = () => {
    if (repeatType === 0) {
      setRepeatCond(targetDay);
    } else if (repeatType === 1) {
      console.log(targetDate);
      setRepeatCond(targetDate);
    } else if (repeatType === 2) {
      setRepeatCond(Number(String(targetWeek) + String(targetDay)));
    }
  };

  // 曜日文字列を数値に変換
  const convertDayString = (day: string) => {
    if (day === "月") {
      return 0;
    } else if (day === "火") {
      return 1;
    } else if (day === "水") {
      return 2;
    } else if (day === "木") {
      return 3;
    } else if (day === "金") {
      return 4;
    } else if (day === "土") {
      return 5;
    } else if (day === "日") {
      return 6;
    }
  };

  return (
    <Flex direction="row" align="start" mb={10}>
      <Box w="30%" mb={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>title</FormLabel>
            <Input
              id="title"
              type="text"
              {...register("title", { required: "タスクタイトルは必須です" })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>content</FormLabel>
            <Input
              id="content"
              type="text"
              {...register("content", { required: "タスク本文は必須です" })}
            />
            <FormErrorMessage>
              {errors.content && errors.content.message}
            </FormErrorMessage>
          </FormControl>
          <HStack mt={2}>
            <Icon
              as={
                isDisplayAnswer
                  ? RiCheckboxCircleFill
                  : RiCheckboxBlankCircleLine
              }
              color="teal"
              w={10}
              h={10}
              onClick={() => setIsDisplayAnswer(!isDisplayAnswer)}
              _hover={{ cursor: "pointer" }}
            />
            <Box
              _hover={{ cursor: "pointer" }}
              onClick={() => setIsDisplayAnswer(!isDisplayAnswer)}
            >
              回答状況表示
            </Box>
          </HStack>
          <Input
            type="datetime-local"
            onChange={(e) => {
              updateDeadLineAt(
                e.target.value ? new Date(e.target.value) : null
              );
            }}
          ></Input>
          <HStack mt={2}>
            <Icon
              as={isShutout ? RiCheckboxCircleFill : RiCheckboxBlankCircleLine}
              color="teal"
              w={10}
              h={10}
              onClick={() => setIsShutout(!isShutout)}
              _hover={{ cursor: "pointer" }}
            />
            <Box
              _hover={{ cursor: "pointer" }}
              onClick={() => setIsShutout(!isShutout)}
            >
              強制締切
            </Box>
          </HStack>

          <HStack mt={5}>
            <Icon
              as={isRepeat ? RiCheckboxCircleFill : RiCheckboxBlankCircleLine}
              color="teal"
              w={10}
              h={10}
              onClick={() => setIsRepeat(!isRepeat)}
              _hover={{ cursor: "pointer" }}
            />
            <Box
              _hover={{ cursor: "pointer" }}
              onClick={() => setIsRepeat(!isRepeat)}
            >
              繰り返し設定
            </Box>
          </HStack>
          <Flex direction="column">
            <HStack>
              <Icon
                as={
                  isRepeat && repeatType === 0
                    ? RiCheckboxCircleFill
                    : RiCheckboxBlankCircleLine
                }
                color="teal"
                w={10}
                h={10}
                onClick={() => setRepeatType(0)}
                _hover={{ cursor: "pointer" }}
              />
              <Box
                _hover={{ cursor: "pointer" }}
                onClick={() => setRepeatType(0)}
              >
                毎週
              </Box>
              <Select
                w={20}
                onChange={(e) => {
                  const cond = convertDayString(String(e.target.value));
                  setTargetDay(Number(cond));
                }}
              >
                <option value="月">月</option>
                <option value="火">火</option>
                <option value="水">水</option>
                <option value="木">木</option>
                <option value="金">金</option>
                <option value="土">土</option>
                <option value="日">日</option>
              </Select>
              <Box>曜日</Box>
            </HStack>

            <HStack>
              <Icon
                as={
                  isRepeat && repeatType === 1
                    ? RiCheckboxCircleFill
                    : RiCheckboxBlankCircleLine
                }
                color="teal"
                w={10}
                h={10}
                onClick={() => setRepeatType(1)}
                _hover={{ cursor: "pointer" }}
              />
              <Box
                _hover={{ cursor: "pointer" }}
                onClick={() => setRepeatType(1)}
              >
                毎月
              </Box>
              <Input
                type="number"
                w={20}
                disabled={repeatType !== 1}
                onChange={(e) => {
                  setTargetDate(Number(e.target.value));
                }}
              ></Input>
              <Box>日</Box>
            </HStack>

            <HStack>
              <Icon
                as={
                  isRepeat && repeatType === 2
                    ? RiCheckboxCircleFill
                    : RiCheckboxBlankCircleLine
                }
                color="teal"
                w={10}
                h={10}
                onClick={() => setRepeatType(2)}
                _hover={{ cursor: "pointer" }}
              />
              <Box
                _hover={{ cursor: "pointer" }}
                onClick={() => setRepeatType(2)}
              >
                〇週△曜日
              </Box>
              <Input
                type="number"
                w={20}
                disabled={repeatType !== 2}
                onChange={(e) => setTargetWeek(Number(e.target.value))}
              ></Input>
              <Box>週</Box>
              <Select
                w={20}
                onChange={(e) => {
                  const cond = convertDayString(String(e.target.value));
                  setTargetDay(Number(cond));
                }}
              >
                <option value="月">月</option>
                <option value="火">火</option>
                <option value="水">水</option>
                <option value="木">木</option>
                <option value="金">金</option>
                <option value="土">土</option>
                <option value="日">日</option>
              </Select>
              <Box>曜日</Box>
            </HStack>
          </Flex>

          <Box>
            <Button type="submit" colorScheme="teal" mt={5} w="100%">
              Submit
            </Button>
            <Button
              type="button"
              colorScheme="blue"
              mt={5}
              w="100%"
              onClick={isAll ? retrieveAllTask : retrieveTargetTask}
            >
              GET
            </Button>
            <Button
              type="button"
              colorScheme="red"
              mt={5}
              w="100%"
              onClick={deleteTask}
            >
              Delete
            </Button>
            <HStack mt={2}>
              <Icon
                as={isAll ? RiCheckboxCircleFill : RiCheckboxBlankCircleLine}
                color="teal"
                w={10}
                h={10}
                onClick={() => setIsAll(!isAll)}
                _hover={{ cursor: "pointer" }}
              />
              <Box
                _hover={{ cursor: "pointer" }}
                onClick={() => setIsAll(!isAll)}
              >
                全タスク取得
              </Box>
            </HStack>
          </Box>
        </form>
      </Box>
      <Box ml={10}>
        <Flex direction="row">
          <Flex direction="column" mr={10}>
            <Heading size="md" mb={3}>
              タスク一覧
            </Heading>
            {isAll
              ? taskList.map((task) => {
                  return (
                    <Text
                      key={task.id}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => {
                        setTaskId(task.id);
                        setSelectedTask(task);
                        onOpen();
                      }}
                    >
                      {task.title}
                    </Text>
                  );
                })
              : taskStatusList.map((taskStatus) => {
                  return (
                    <Text key={taskStatus.task.id}>
                      {taskStatus.task.title}
                    </Text>
                  );
                })}

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
              <ModalOverlay />

              <ModalContent>
                <ModalHeader>タスク詳細</ModalHeader>
                <ModalCloseButton />
                <Divider border="2px" w="95%" mx="auto" borderColor="orange" />
                <ModalBody pb={6}>
                  <Flex direction="column">
                    <HStack>
                      <Box fontWeight="bold">タスクID:</Box>
                      <Box>{selectedTask?.id}</Box>
                    </HStack>
                    <Flex direction="row" align="center">
                      <Box fontWeight="bold" mr={3} w="12%">
                        タスクタイトル:
                      </Box>
                      <Input
                        defaultValue={selectedTask?.title}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                      ></Input>
                    </Flex>
                    <Flex direction="row" align="center">
                      <Box fontWeight="bold" mr={3} w="12%">
                        タスク本文:
                      </Box>
                      <Input
                        defaultValue={selectedTask?.content}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                      ></Input>
                    </Flex>
                    <HStack>
                      <Box fontWeight="bold">完了状況:</Box>
                      <Box>{selectedTask?.is_done ? "完了" : "未完了"}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">選択肢有無:</Box>
                      <Box>{selectedTask?.is_choice ? "有" : "無"}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">回答状況表示設定:</Box>
                      <Box>
                        {selectedTask?.is_display_answer ? "表示" : "非表示"}
                      </Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">締切有無:</Box>
                      <Box>{selectedTask?.is_deadline ? "有" : "無"}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">強制締切:</Box>
                      <Box>{selectedTask?.is_shutout ? "する" : "しない"}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">締切日時:</Box>
                      <Box>
                        {selectedTask?.deadline_at
                          ? String(selectedTask?.deadline_at)
                          : "---"}
                      </Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">繰り返し:</Box>
                      <Box>{selectedTask?.is_repeat ? "する" : "しない"}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">繰り返し条件種類:</Box>
                      <Box>
                        {selectedTask?.is_repeat &&
                          selectedTask?.repeat_type === 0 &&
                          "毎週"}
                      </Box>
                      <Box>
                        {selectedTask?.is_repeat &&
                          selectedTask?.repeat_type === 1 &&
                          "毎月"}
                      </Box>
                      <Box>
                        {selectedTask?.is_repeat &&
                          selectedTask?.repeat_type === 2 &&
                          "〇週△曜日"}
                      </Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">繰り返し条件:</Box>
                      <Box>{selectedTask?.repeat_cond}</Box>
                    </HStack>
                    <HStack>
                      <Box fontWeight="bold">作成日時:</Box>
                      <Box>{String(selectedTask?.created_at)}</Box>
                    </HStack>
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    borderRadius={50}
                    w={150}
                    mr={3}
                    shadow="md"
                    onClick={() => {
                      onClose();
                      updateTask();
                    }}
                  >
                    更新
                  </Button>
                  <Button
                    colorScheme="orange"
                    borderRadius={50}
                    w={150}
                    shadow="md"
                    onClick={onClose}
                  >
                    閉じる
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          <Flex direction="column">
            <Heading size="sm">【選択タスクID】</Heading>
            <Box>{taskId}</Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
