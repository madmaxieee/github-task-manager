import { signOut } from "next-auth/react";
import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export const SignOutButton = () => {
  return (
    <Button
      onClick={() => {
        signOut().catch(console.error);
      }}
      variant="outline"
      color="red"
      className="m-4"
      leftIcon={<IconLogout />}
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
