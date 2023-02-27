import type { ReactNode } from "react";
import Image from "next/image";
import { Header as MantineHeader } from "@mantine/core";
import { IconBrandGithub, IconX } from "@tabler/icons-react";

export interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children = <></> }: HeaderProps) => {
  return (
    <MantineHeader height={60}>
      <div className="flex h-full items-center justify-between">
        <div className="flex h-full items-center gap-2 p-4">
          <IconBrandGithub size={36} />
          <IconX size={24} />
          <Image
            src="/assets/images/avatar.png"
            alt="avatar of madmaxieee, 莊加旭"
            width={36}
            height={36}
            className="rounded-md"
          />
        </div>
        {children}
      </div>
    </MantineHeader>
  );
};

export default Header;
