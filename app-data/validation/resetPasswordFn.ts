import { verifyPasswordSchema } from "./validationTypes";
import { confirmResetPassword } from "aws-amplify/auth";
import { router } from "expo-router";
import { ZodError } from "zod";
export const resetPasswordFn = async (
  email: string | string[],
  password: string,
  confirmPassword: string,
  code: string,
  alert: (
    title: string,
    description: string,
    type: "success" | "error"
  ) => void,
  route: string,
  triggerLoadingScreen: (isLoading: boolean) => void
) => {
  try {
    verifyPasswordSchema.parse({ password, confirmPassword });
    if (password !== confirmPassword) {
      alert("", "Passwords do not match", "error");
      return;
    }
    if (typeof email === "string") {
      triggerLoadingScreen(true);
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password,
      })
        .then(() => {
          triggerLoadingScreen(false);
          router.navigate(route);
        })
        .catch((error: unknown) => {
          triggerLoadingScreen(false);
          if (error instanceof Error) {
            alert("", error.message, "error");
          } else {
            alert("", "An unknown error occurred", "error");
          }
          return;
        });
    } else {
      triggerLoadingScreen(false);
      alert("", "Invalid email format", "error");
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.log(error);
      const message = error.errors[0].message;
      alert("", message, "error");
      return;
    }
  }
};
