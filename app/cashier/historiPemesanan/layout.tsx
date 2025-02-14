import ManagerTemplate from "@/components/managerTemplate";
import MenuList from "../menuListC";

export const metadata = {
  title: "History | Ordering System",
  description: "Generated by create next app",
};

type PropsLayout = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <ManagerTemplate title="History" id="history" menuList={MenuList}>
      {children}
    </ManagerTemplate>
  );
};

export default RootLayout;
