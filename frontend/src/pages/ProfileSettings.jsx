import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { User, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  profileUpdateSchema,
  changePasswordFormSchema,
} from "../lib/schema";
import { useMe } from "../hooks/auth/useMe";
import { useUpdateProfile } from "../hooks/auth/useUpdateProfile";
import { useChangePassword } from "../hooks/auth/useChangePassword";
import { updateUser } from "../../store/auth/authSlice";
export default function ProfileSettings() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((s) => s.auth.user);
  const { data: me, isSuccess } = useMe();
  const { mutateAsync: saveProfile, isPending: savingProfile } =
    useUpdateProfile();
  const { mutateAsync: savePassword, isPending: savingPassword } =
    useChangePassword();

  useEffect(() => {
    if (isSuccess && me) {
      dispatch(updateUser(me));
    }
  }, [isSuccess, me, dispatch]);

  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: reduxUser?.name || "",
      profilePicture: reduxUser?.profilePicture || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const u = me || reduxUser;
    if (!u) return;
    profileForm.reset({
      name: u.name || "",
      profilePicture: u.profilePicture || "",
    });
  }, [me, reduxUser, profileForm]);

  const onProfile = async (values) => {
    try {
      const payload = {
        name: values.name,
        ...(values.profilePicture !== undefined
          ? { profilePicture: values.profilePicture }
          : {}),
      };
      const res = await saveProfile(payload);
      window.toastify?.(res?.message || "Profile saved", "success");
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not save profile",
        "error"
      );
    }
  };

  const onPassword = async (values) => {
    try {
      const res = await savePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      window.toastify?.(res?.message || "Password updated", "success");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not update password",
        "error"
      );
    }
  };

  const display = me || reduxUser;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-200/30 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          <ArrowLeft className="size-4" />
          Back to app
        </Link>

        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Account
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your profile
            </h1>
            <p className="max-w-xl text-base text-slate-600">
              Update how you appear across Taskio — name, avatar link, and
              password security in one polish place.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
            <Avatar className="size-14 border-2 border-white shadow-lg ring-2 ring-violet-100">
              {display?.profilePicture ? (
                <AvatarImage src={display.profilePicture} alt="" />
              ) : null}
              <AvatarFallback className="bg-violet-100 text-lg font-bold text-violet-800">
                {display?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {display?.name}
              </p>
              <p className="truncate text-sm text-slate-500">{display?.email}</p>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl border-slate-200/90 shadow-xl shadow-violet-200/40 ring-1 ring-slate-100">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl">Preferences</CardTitle>
            <CardDescription>
              Account details sync across workspaces you belong to.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 rounded-2xl bg-slate-100/80 p-1">
                <TabsTrigger
                  value="profile"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <User className="mr-2 size-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Lock className="mr-2 size-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfile)}
                    className="space-y-5"
                  >
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display name</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl border-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="profilePicture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile picture URL</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl border-slate-200"
                              placeholder="https://…"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Paste a public image URL. Leave empty to clear.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={savingProfile}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                      {savingProfile ? "Saving…" : "Save profile"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
                  Use a strong password you do not reuse elsewhere. Forgot it?{" "}
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-amber-900 underline-offset-2 hover:underline"
                  >
                    Reset via email
                  </Link>
                  .
                </div>
                <Separator />
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPassword)}
                    className="space-y-5"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="rounded-xl border-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="rounded-xl border-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm new password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="rounded-xl border-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={savingPassword}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                      {savingPassword ? "Updating…" : "Update password"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
