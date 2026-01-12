import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordSchema } from "../../lib/schema";

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
// Simple schema for email

const ForgotPassword = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Forgot Password Email:", data.email);
    // API call here
  };

  return (
    <div
      className="max-w-md mx-auto mt-20 p-6 border rounded-xl 
                    shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Back to login */}
      <Link
        to="/sign-in"
        className="group inline-flex items-center gap-1 text-sm text-gray-600 
             hover:text-gray-700 mb-4 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-300 ease-out 
               group-hover:-translate-x-1"
        />
        Back to Login
      </Link>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-center">Forgot Password?</h2>
      <p className="text-center mb-6 text-gray-600 text-sm">
        Enter your email and we’ll send you a reset link
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button */}
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        {/* Bottom link */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Remember your password?{" "}
          <Link to="/sign-in" className="text-blue-700 hover:text-blue-900">
            Login
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default ForgotPassword;
