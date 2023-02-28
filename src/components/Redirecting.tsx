import { Center, AppShell, Loader } from "@mantine/core";
import Header from "@/components/Header";

export const Redirecting = () => {
  return (
    <AppShell header={<Header />}>
      <Center className="h-full">
        <Loader />
      </Center>
    </AppShell>
  );
};

export default Redirecting;
