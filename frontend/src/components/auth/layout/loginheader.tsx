import AuthHeader from "./authheader";

export default function RegisterHeader() {
  return <AuthHeader actionHref="/account/login" actionLabel="Login" />;
}