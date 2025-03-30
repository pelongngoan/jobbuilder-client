import { Feed } from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import LeftSidebar from "../components/home/LeftSidebar";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <LeftSidebar />
        <Feed />
        {/* <RightSidebar /> */}
      </div>
    </MainLayout>
  );
}
