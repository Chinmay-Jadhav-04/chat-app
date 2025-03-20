import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex justify-end p-4">
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
}
