import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams?: { registered?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const registered = Boolean(searchParams?.registered);

  return <LoginForm registered={registered} />;
}
