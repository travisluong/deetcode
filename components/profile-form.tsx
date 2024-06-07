"use client";

import { UserDB } from "@/lib/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";
import updateProfile, { UpdateProfileState } from "@/actions/update-profile";

export default function ProfileForm({ user }: { user: UserDB }) {
  const initialState: UpdateProfileState = {};
  const [state, dispatch] = useFormState(updateProfile, initialState);

  return (
    <div className="my-5">
      <form action={dispatch} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label>Username</Label>
          <Input type="text" name="username" defaultValue={user.username} />
          {state.errors?.username?.map((error) => (
            <p key={error} className="text-red-500">
              {error}
            </p>
          ))}
        </div>
        <div>
          <SubmitButton />
        </div>
        {state.status === "error" && state.message && (
          <p className="text-red-500">{state.message}</p>
        )}
        {state.status === "success" && state.message && (
          <p className="text-green-500">{state.message}</p>
        )}
      </form>
    </div>
  );
}
