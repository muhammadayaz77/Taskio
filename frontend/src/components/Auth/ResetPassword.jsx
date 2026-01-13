import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { resetPasswordSchema } from "../../lib/schema";
import { useResetPassword } from '../../hooks/auth/useResetPassword.js'

const ResetPassword = () => {
  const { token } = useParams(); // ✅ get token from URL
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending } = useResetPassword();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log("token : ",token)
    mutate(
      {
        ...data,
        token
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Back to login */}
      <Link
        to="/sign-in"
        className="group inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 mb-4 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
        />
        Back to Login
      </Link>

      {isSuccess ? (
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
          <h2 className="text-2xl font-semibold">
            Password Reset Successful
          </h2>
          <p className="mb-6 text-gray-600 text-sm">
            You can now log in with your new password
          </p>

          <Link to="/sign-in">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center">
            Reset Password
          </h2>
          <p className="text-center mb-6 text-gray-600 text-sm">
            Enter your new password below
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
