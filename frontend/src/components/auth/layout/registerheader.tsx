import AuthHeader from "./authheader";

export default function LoginHeader() {
  return <AuthHeader actionHref="/account/register" actionLabel="Register" />;
}