import { ZodError } from "zod";
import { verifyEmailSchema } from "./validationTypes";
import { resetPassword } from "aws-amplify/auth";
import { router } from "expo-router";
import { localData } from "../appData";
import { Profile } from "../data-types";

export const verifyEmailFn = async (
  email: string,
  alert: (
    title: string,
    description: string,
    result: "success" | "error"
  ) => void,
  route: string,
  profile: Profile | null,
) => {
  try {
    verifyEmailSchema.parse({ email });
    if(email.includes("gmail")){
        alert("", "Please use a non-Gmail email address", "error");
        return;
    }

    if (profile) {
        if(profile.email !== email) {
            alert("", "Wrong email provided", "error");
            return;
        }   
    }

    const result = await resetPassword({username: email});
    const { nextStep} = result;
    if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
      router.replace({
        pathname: route,
        params: {
          email: email,
        },
      });
    } else {
      alert("", "An error occurred while sending the code", "error");
      return;
    }

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const message = error.errors[0].message;
      alert("", message, "error");
      return;
    }
  }
};
