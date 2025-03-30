import MainLayout from "../components/layout/MainLayout";
import LeftSidebar from "../components/home/LeftSidebar";
import Feed from "../components/home/Feed";
import RightSidebar from "../components/home/RightSidebar";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </MainLayout>
  );
}
