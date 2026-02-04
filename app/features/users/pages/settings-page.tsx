import InputPair from "~/common/components/ui/input-pair";
import type { Route } from "./+types/settings-page";
import { Form } from "react-router";
import SelectPair from "~/common/components/select-pair";
import { useState } from "react";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUserId, getUserById } from "../queries";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";
import { updateUser, updateUserAvatar } from "../mutations";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = () => {
    return [{title: "Settings | Wemake"}];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const user = await getUserById(client, { id: userId });
    return { user };
  };
  
  const formSchema = z.object({
    name: z.string().min(3),
    role: z.string(),
    headline: z.string().optional().default(""),
    bio: z.string().optional().default(""),
  });
  
  export const action = async ({ request }: Route.ActionArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const formData = await request.formData();
    const avatar = formData.get("avatar");
  if (avatar && avatar instanceof File) {
    if (avatar.size <= 2097152 && avatar.type.startsWith("image/")) {
      const { data, error } = await client.storage
        .from("avatars")
        .upload(`${userId}/${Date.now()}`, avatar, {          
            contentType: avatar.type,
          upsert: false,
        });
      if (error) {
        console.log(error);
        return { formErrors: { avatar: ["Failed to upload avatar"] } };
      }
      const {
        data: { publicUrl },
      } = await client.storage.from("avatars").getPublicUrl(data.path);
      await updateUserAvatar(client, {
        id: userId,
        avatarUrl: publicUrl,
      });
    } else {
      return { formErrors: { avatar: ["Invalid file size or type"] } };
    }
  } else {
    const { success, error, data } = formSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      return { formErrors: error.flatten().fieldErrors };
    }
    const { name, role, headline, bio } = data;
    await updateUser(client, {
      id: userId,
      name,
      role: role as
        | "developer"
        | "designer"
        | "marketer"
        | "founder"
        | "product-manager",
      headline,
      bio,
    });
    return {
      ok: true,
    };
    }
  };
  
  export default function SettingsPage({
    loaderData,
    actionData,
  }: Route.ComponentProps) {
    const [avatar, setAvatar] = useState<string | null>(loaderData.user.avatar);
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            const file = event.target.files[0];
            setAvatar(URL.createObjectURL(file));
        }
    }
    return (
        <div className="space-y-20">
            <div className="grid grid-cols-6 gap-40">
                <div className="col-span-4 flex flex-col gap-10">
                    <h2 className="text-2xl font-semibold">Edit Profile</h2>
                    <Form className="flex flex-col w-1/2 gap-5" method="post">
                        <InputPair
                        label = "Name"
                        description ="Your public name"
                        required
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        defaultValue={loaderData.user.name}
                        />
                        {actionData?.formErrors && "name" in actionData?.formErrors ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                {actionData.formErrors?.name?.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <SelectPair
                        label = "Role"
                        defaultValue={loaderData.user.role}
                        description ="What role do you identify the most with?"
                        required
                        name="role"
                        placeholder="Select a role"
                        options={[
                            { label: "Developer", value: "developer" },
                            { label: "Designer", value: "designer" },
                            { label: "Product Manager", value: "product-manager" },
                            { label: "Founder", value: "founder" },
                            { label: "Marketer", value: "marketer" },
                        ]}
                        />
                        {actionData?.formErrors && "role" in actionData?.formErrors ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                {actionData.formErrors?.role?.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <InputPair
                        label = "Headline"
                        description ="A short headline to describe yourself."
                        required
                        defaultValue={loaderData.user.headline ?? ""}
                        id="headline"
                        name="headline"
                        placeholder="I am a cutie sexy pie!"
                        textArea
                        />
                        {actionData?.formErrors && "headline" in actionData?.formErrors ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                {actionData.formErrors?.headline?.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <InputPair
                        label = "Name"
                        description ="Your public bio. It will be displayed on your profile page."
                        required
                        id="bio"
                        defaultValue={loaderData.user.bio ?? ""}
                        name="bio"
                        placeholder="I am a cutie sexy pie! And the founder of Wemake."
                        textArea
                        />
                        {actionData?.formErrors && "bio" in actionData?.formErrors ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                {actionData.formErrors?.bio?.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <Button className="w-full">Update Profile</Button>
                    </Form>
                </div>
                <Form
                    className="col-span-2 p-6 rounded-lg border shadow-md"
                    method="post"
                    encType="multipart/form-data"
                >
                    <Label className="flex flex-col gap-1">
                        Avatar
                        <small className="text-muted-foreground">This is your avatar.</small>
                    </Label>
                    <div className="space-y-2 flex flex-col">
                    <div className="space-y-5">
                        <div className="size-40 rounded-full shadow-xl overflow-hidden mx-auto">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : null}
                        </div>
                        <Input type="file" className="w-full" onChange={onChange} required name="avatar"/>
                        {actionData?.formErrors && "avatar" in actionData?.formErrors ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                {actionData.formErrors.avatar.join(", ")}
                                </AlertDescription>
                            </Alert>
                            ) : null
                        }
                        <div className="flex flex-col text-xs">
                            <span className="text-muted-foreground">Recommended size: 128x128px</span>
                            <span className="text-muted-foreground">Allowed format: PNG, JPEG</span>
                        </div>
                    </div>
                    <Button>Update Avatar</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
