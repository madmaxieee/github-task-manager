import type { ReactNode } from "react";
import { Header as MantineHeader, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

export interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children = <></> }: HeaderProps) => {
  return (
    <MantineHeader height={60}>
      <div className="flex h-full items-center justify-between">
        <div className="flex h-full items-center gap-2 p-4">
          <IconBrandGithub size={24} />
          <Title order={4}>Task Manager</Title>
        </div>
        {children}
      </div>
    </MantineHeader>
  );
};

export default Header;
