import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import jsondjangoapp from "../api/jsondjangoapp";

type UserInfo = {
  id: string;
  staff_num: number;
  user_id: string;
  name: string;
  password: string;
  is_active: boolean;
  is_staff: boolean;
  is_manager: boolean;
  login_at: Date;
  not_active_at: Date;
  created_at: Date;
};

export function User() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInfo>();

  // ユーザー登録
  const onSubmit: SubmitHandler<UserInfo> = async (data) => {
    try {
      const user = await jsondjangoapp.post("/api/user/register/", {
        staff_num: data.staff_num,
        name: data.name,
        email: data.user_id,
        password: data.password,
        is_manager: false,
      });
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box w="60vh">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>従業員番号</FormLabel>
          <Input
            id="staff_num"
            type="number"
            {...register("staff_num", { required: "従業員番号は必須です" })}
          />
          <FormErrorMessage>
            {errors.staff_num && errors.staff_num.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>名前</FormLabel>
          <Input
            id="name"
            type="text"
            {...register("name", { required: "名前は必須です" })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            id="user_id"
            type="email"
            {...register("user_id", { required: "メールアドレスは必須です" })}
          />
          <FormErrorMessage>
            {errors.user_id && errors.user_id.message}
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
  );
}
