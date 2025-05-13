
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsappIcon } from "@/components/WhatsappIcon";

const forgotPasswordSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword, isLoading } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await resetPassword(values.email);
      form.reset();
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-white">
            <WhatsappIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">WhatsApp CRM</h1>
          <p className="text-slate-600">Gerencie suas conversas com eficiência</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Esqueceu sua Senha?</CardTitle>
            <CardDescription>
              Enviaremos um link para redefinir sua senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <span className="text-sm text-gray-600">
              Lembrou a senha?{" "}
              <Link to="/login" className="text-whatsapp hover:underline">
                Voltar para o Login
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
