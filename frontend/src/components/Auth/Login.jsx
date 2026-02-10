// components/LoginForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { loginSchema } from "../../lib/schema";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/auth/useLogin";

const LoginForm = () => {
  const {mutate,isPending} = useLogin()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // API call here
    mutate(data)
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl 
                shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-2xl font-semibold  text-center">
        Welcome Back
      </h2>
      <p className="text-center mb-6 text-gray-600 text-sm">Sign in to your account to continue</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                <FormLabel>Password</FormLabel>
                <Link to='/forgot-password' className='text-blue-700 hover:text-blue-900 cursor-pointer border-blue-900'>Forgot password</Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
            {
              isPending ? 'Loading...' : 'Login'
            }
          </Button>
        </form>
          <p className="text-gray-500 text-sm text-center mt-6">Don't have an account? <Link to='/sign-up' className="text-blue-700 hover:text-blue-900 border-blue-900">Signup</Link></p>
      </Form>
    </div>
  );
};

export default LoginForm;
